function parse_tuition(t) {
  let tuition;
  if (t == 'none') {
    tuition = 'none';
  } else if (t.length > 3) {
    tuition = [parseInt(t.join('')), 'none'];
  } else if (t.length == 2) {
    tuition = [];
    for (let i=0; i<2; i++) {
      if (t[i] != '' && t[i] != 0) {
        tuition.push(+t[i]);
      } else {
        tuition.push('none')
      }
    }
  } else {
    tuition = 'none';
  }
  return tuition;
}

function parse_table(t) {
  if (t == 'none') return t;

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
    console.log("I am sad to exist");
    console.log(name);
  }

  return {
    'gender': {
      'male': men_total,
      'female': women_total
    },
    'ethnicity': ethnicities
  }
}