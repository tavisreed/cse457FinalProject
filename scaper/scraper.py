from bs4 import BeautifulSoup
import asyncio
import time
import threading
from aiohttp import ClientSession
import re
import json
from tqdm import tqdm

async def get(url):
  async with ClientSession() as session:
    async with session.get(url) as response:
      return await response.read()

def parse_table(table):
  return [[el.text for el in row.find_all(['th', 'td'])] for row in table.find_all('tr')]

# get home page
print('getting home page')
base_url = 'http://profiles.asee.org'
loop = asyncio.get_event_loop()
res = loop.run_until_complete(get(base_url))
base_soup = BeautifulSoup(res, 'html.parser')

# extract school profile links
print('getting profile links')
schools = base_soup.find('table').find_all('td', class_='school_name')
profile_links = [base_url+school.a['href'] for school in schools]

# async get all school home pages
print('begin fetching school home pages')
profile_html = loop.run_until_complete(asyncio.gather(*[get(link) for link in profile_links]))

# parse school ids for all years
print('extracting school ids by year')
school_ids = []
for profile in tqdm(profile_html):
  profile_soup = BeautifulSoup(profile, 'html.parser')
  profile_ids = profile_soup.find('select', id='survey_id').find_all('option')
  profile_dict = {pid.text: pid['value'] for pid in profile_ids}
  school_ids.append(profile_dict)

# setup fetch by year
print('setting up main fetch')
fetch = {}
profile_base = 'http://profiles.asee.org/profiles/{}/print_all'
for school in tqdm(school_ids):
  for year, sid in school.items():
    entry = get(profile_base.format(sid))
    if year in fetch:
      fetch[year].append(entry)
    else: fetch[year] = [entry]

# main fetch sequence
print('begin main fetch sequence')
for year, fids in tqdm(fetch.items()):
  year_data = []

  # get all school pages for year
  print('getting school pages for {}'.format(year))
  school_res = loop.run_until_complete(asyncio.gather(*fids))

  # parge school html
  print('begin parsing school html for {}'.format(year))
  for school_html in tqdm(school_res):
    soup = BeautifulSoup(school_html, 'html.parser')
    
    # initialize values
    institution_type = 'none'
    undergrad_enroll = 'none'
    graduate_enroll = 'none'
    description = 'none'
    freshmen_enroll_table = 'none'
    sophomore_enroll_table = 'none'
    junior_enroll_table = 'none'
    senior_enroll_table = 'none'
    teaching_tenure_table = 'none'
    tuition = 'none'
    sat_scores = 'none'
    act_scores = 'none'
    degree_table = 'none'
    
    # extract attributes
    name = soup.find('h1').text[:-7]
    print('school: {}'.format(name))

    try:
      institution_type = soup.find('h3', text='General Information').find_next_sibling('table').find_all('td')[1].text
    except AttributeError:
      print('bad institution_type for {}'.format(name))
      
    try:
      undergrad_enroll = soup.find('p', class_='highlighted', text='Total Enrollment').find_next_sibling('table').find_all('td')[1].text.replace(',','')
      graduate_enroll = soup.find('p', class_='highlighted', text='Total Enrollment').find_next_sibling('table').find_all('td')[3].text.replace(',','')
    except AttributeError:
      print('bad enrollment for {}'.format(name))
    
    try:
      description = soup.find('p', class_='highlighted', text='Engineering College Description and Special Characteristics').find_next_sibling('p').text
    except AttributeError:
      print('bad description for {}'.format(name))

    try:
      freshmen_table = soup.find('p', class_='highlighted', text='Freshmen').find_next_sibling('table')
      sophomore_table = soup.find('p', class_='highlighted', text='Sophomores').find_next_sibling('table')
      junior_table = soup.find('p', class_='highlighted', text='Juniors').find_next_sibling('table')
      senior_table = soup.find('p', class_='highlighted', text='Seniors').find_next_sibling('table')
      freshmen_enroll_table = parse_table(freshmen_table)
      sophomore_enroll_table = parse_table(sophomore_table)
      junior_enroll_table = parse_table(junior_table)
      senior_enroll_table = parse_table(senior_table)
      freshmen_enroll_table = [e for e in freshmen_enroll_table if ('Note' not in e[0])]
      sophomore_enroll_table = [e for e in sophomore_enroll_table if ('Note' not in e[0])]
      junior_enroll_table = [e for e in junior_enroll_table if ('Note' not in e[0])]
      senior_enroll_table = [e for e in senior_enroll_table if ('Note' not in e[0])]
    except AttributeError:
      print('bad enrollment tables for {}'.format(name))
        
    try: 
      teaching_tenure = soup.find('p', class_='highlighted', text='Teaching, Tenure-Track: Full Professor Profiles').find_next_sibling('table')
      teaching_tenure_table = parse_table(teaching_tenure)
    except AttributeError:
      print('bad teaching_tenure for {}'.format(name))

    try:
      tuition_list = parse_table(soup.find('h3', text='Expenses & Financial Aid').find_next_sibling('table'))[1]
      tuition = tuition_list[1:3] if len(tuition_list) > 2 else tuition_list[1]
      tuition = [t.replace('$','').replace(',','') for t in tuition]
    except AttributeError:
      print('bad tuition for {}'.format(name))

    try:
      test_scores = soup.find('p', class_='highlighted', text=' Newly Enrolled Test Scores').find_next_sibling('table')
      sat_scores = parse_table(test_scores)
      act_scores = parse_table(test_scores.find_next_sibling('table'))
    except AttributeError:
      print('bad test_scores for {}'.format(name))

    try: 
      degrees = soup.find('p', class_='highlighted', text='Degrees By Ethnicity & Gender').find_next_sibling('table')
      degrees = parse_table(degrees)
      degree_table = [e for e in degrees if ('Note' not in e[0])]
    except AttributeError:
      print('bad degree table for {}'.format(name))

    year_data.append({
      'name': name,
      'type': institution_type,
      'undergrad_enroll': undergrad_enroll,
      'graduate_enroll': graduate_enroll,
      'description': description,
      'freshmen_enroll_table': freshmen_enroll_table,
      'sophomore_enroll_table': sophomore_enroll_table,
      'junior_enroll_table': junior_enroll_table,
      'senior_enroll_table': senior_enroll_table,
      'teaching_tenure_table': teaching_tenure_table,
      'tuition': tuition,
      'sat_scores': sat_scores,
      'act_scores': act_scores,
      'degree_table': degree_table
    })

  with open('data/{}data.json'.format(year), 'w') as outfile:
    json.dump(year_data, outfile)

loop.close()
