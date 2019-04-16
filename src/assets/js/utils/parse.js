function parse_tuition(t) {
  let tuition;
  if (t == 'none') {
    tuition = 'none';
  } else if (t.length == 1 || t.length == 2) {
    tuition = ['none', 'none'];
    for (let i=0; i<t.length; i++) {
      if (t[i] != '' && t[i] != 0) {
        tuition[i] = +t[i];
      }
    }
    if (!tuition[0]) tuition = 'none';
  } else {
    tuition = 'none';
  }
  return tuition;
}

function parse_table(t) {
  if (t == 'none') return 'none';

  let header2009 = [
    "African-American",
    "Asian-American",
    "Hispanic",
    "Native American",
    "Caucasian",
    "Foreign National",
    "Other",
    "Total"
  ];

  let header2010 = [
    "Nonresident Alien",
    "Unknown",
    "Hispanic",
    "American Indian",
    "Asian",
    "Black",
    "Pacific Islander",
    "White",
    "Two or More",
    "Total"
  ];

  let men_total = 0;
  let women_total = 0;

  // get gender totals
  for (let i=0; i<t.length; i++) {
    if (t[i][0] == 'Men') {
      let row_total = (+t[i][t[i].length-1])+(+t[i][t[i].length-2]);
      men_total += row_total;
    } else if (t[i][0] == 'Women') {
      let row_total = (+t[i][t[i].length-1])+(+t[i][t[i].length-2]);
      women_total += row_total;
    }
  }

  // get ethnicity totals
  let totals = t[t.length-1].slice(1);
  let etotals = [];
  for (let i=0; i<totals.length; i++) {
    if (i%2 == 0) etotals.push((+totals[i])+(+totals[i+1]));
  }

  let ethnicities = {};

  if (etotals.length == 8) {
    // prior 2010 format
    ethnicities['black'] = etotals[0]
    ethnicities['asian'] = etotals[1]
    ethnicities['hispanic'] = etotals[2]
    ethnicities['native-american'] = etotals[3]
    ethnicities['white'] = etotals[4]
    ethnicities['other'] = etotals[5]+etotals[6]+etotals[7];
  } else if (etotals.length == 10) {
    // 2010 and after format
    ethnicities['black'] = etotals[5]
    ethnicities['asian'] = etotals[4]
    ethnicities['hispanic'] = etotals[2]
    ethnicities['native-american'] = etotals[3]
    ethnicities['white'] = etotals[7]
    ethnicities['other'] = etotals[0]+etotals[1]+etotals[6]+etotals[8];
  } else {
    return 'none';
  }

  // get breakdowns
  let total = {'male':{},'female':{}};
  for (let i=0; i<t.length; i++) {
    if (t[i][0] == 'Men' || t[i][0] == 'Women') {
      // get ethnicity totals
      let totals = t[i].slice(1);
      let etotals = [];
      for (let i=0; i<totals.length; i++) {
        if (i%2 == 0) etotals.push((+totals[i])+(+totals[i+1]));
      }

      let ethnicities = {};
      if (etotals.length == 8) {
        // prior 2010 format
        ethnicities['black'] = etotals[0]
        ethnicities['asian'] = etotals[1]
        ethnicities['hispanic'] = etotals[2]
        ethnicities['native-american'] = etotals[3]
        ethnicities['white'] = etotals[4]
        ethnicities['other'] = etotals[5]+etotals[6]+etotals[7];
      } else if (etotals.length == 10) {
        // 2010 and after format
        ethnicities['black'] = etotals[5]
        ethnicities['asian'] = etotals[4]
        ethnicities['hispanic'] = etotals[2]
        ethnicities['native-american'] = etotals[3]
        ethnicities['white'] = etotals[7]
        ethnicities['other'] = etotals[0]+etotals[1]+etotals[6]+etotals[8];
      } else {
        return 'none';
      }

      let gender = 'male';
      if (t[i][0] == 'Women') {
        gender = 'female';
      }

      for (let eth of Object.keys(ethnicities)) {
        if (!total[gender][eth]) total[gender][eth] = 0;
        total[gender][eth] += ethnicities[eth];
      }
    }
  }

  return {
    'total': total,
    'gender': {
      'male': men_total,
      'female': women_total
    },
    'ethnicity': ethnicities
  }

  //return total;
}

function parse_data(data) {
  return data.map(function(d,i) {
    let entry = {
      'name': d.name,
      'type': d.type,
      'index': i,
      'undergrad_enroll': (d.undergrad_enroll == 0) ? 'none' : +d.undergrad_enroll,
      'graduate_enroll': (d.graduate_enroll == 0) ? 'none' : +d.graduate_enroll,
      'description': d.description,
      'freshmen_enroll_table': parse_table(d.freshmen_enroll_table),
      'sophomore_enroll_table': parse_table(d.sophomore_enroll_table),
      'junior_enroll_table': parse_table(d.junior_enroll_table),
      'senior_enroll_table': parse_table(d.senior_enroll_table),
      'teaching_tenure_table': 'none',
      'tuition': parse_tuition(d.tuition),
      'sat_scores': 'none',
      'act_scores': d.act_scores,
      'degree_table': 'none',
    }
    return entry;
  });
}

function year_filter(data) {
  return data.filter(function(d) {
    let attrs = ['type','act_scores','undergrad_enroll','graduate_enroll','tuition','freshmen_enroll_table','sophomore_enroll_table','junior_enroll_table','senior_enroll_table'];
    for (let i=0; i<attrs.length; i++) {
      if (d[attrs[i]] == 'none') return false;
    }
    return true;
  });
}

function synchronize(file_data) {
  let data = {};
  let years = create_years(1999,2018);
  file_data = Object.values(file_data);

  // synchronize schools across years
  let schools = file_data.reduce(function(a,b) {
    let a_names = a.map(function(d) { return d.name; });
    let b_names = b.map(function(d) { return d.name; });
    let intersection = a_names.filter(function(d) {
      return b_names.includes(d);
    });
    return intersection.map(function(d) {
      return { 'name': d };
    });
  });

  // unwrap schools
  schools = schools.map(function(d) { return d.name; });

  // filter by synchronized schools
  file_data.forEach(function(d,i) {
    let slice = d.filter(function(e) {
      return schools.includes(e.name);
    });
    data[years[i]] = slice;
  });

  // recompute indices
  years.forEach(function(year) {
    data[year].forEach(function(d,i) {
      d.index = i;
    });
  });

  return data;
}