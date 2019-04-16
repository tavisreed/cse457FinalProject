function load_data() {
  let q = queue();
  let data = {};
  let years = create_years(1999,2018);

  // queue all year files
  years.forEach(function(d) {
    q.defer(d3.json, 'assets/data/datanew/'+d+'data.json')
  });

  // await all loading files
  q.awaitAll(function(error, file_data) {
    // initial parsing
    file_data.forEach(function(d,i) {
      data[years[i]] = parse_data(d);
    });

    // strip all schools without 2018 data
    data[2018] = year_filter(data[2018]);

    // synchronize schools across years
    data = synchronize(data);

    // start visualizations
    start(data);
  });
}

function start(data) {
  console.log(data);
  let profile = new Profile('profiles', data);
  let cluster = new Cluster('cluster', data);
  //let enrollment = new Histogram('test', data);

  // update message, data done loading
  document.querySelector('#home-message').style.display = 'none';

  // initialize button listeners
  document.querySelector('#both').addEventListener('click', function() {
    cluster.update('both');
  });

  document.querySelector('#gender').addEventListener('click', function() {
    cluster.update('gender');
  });

  document.querySelector('#ethnicity').addEventListener('click', function() {
    cluster.update('ethnicity');
  });

  document.querySelector('#school').addEventListener('click', function() {
    cluster.update('school');
  });

  document.querySelector('#tuition').addEventListener('click', function() {
    cluster.update('tuition');
  });
}

load_data();