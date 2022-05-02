function Weather() {
  //   window.myWidgetParam ? window.myWidgetParam : (window.myWidgetParam = []);
  window.myWidgetParam = [];
  window.myWidgetParam.push({
    id: 11,
    cityid: '2643743',
    lat: '47.6205063',
    lnt: '-122.3492774',
    appid: '6060e464dec17a57b82e0889afbad877',
    units: 'metric',
    containerid: 'openweathermap-widget-11',
  });
  (function () {
    var script = document.createElement('script');
    script.async = true;
    // script.charset = 'utf-8';
    script.src =
      '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  })();

  return (
    <>
      <div id="openweathermap-widget-11"></div>
      <script src="//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>
    </>
  );
}

export default Weather;
