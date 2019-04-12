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
  let header2009 = [
    "Group",
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
    "Group",
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
  
  return;
}