export function googleAPI() {
  return 'AIzaSyAclJIAm-8LUEgGfbnL4fS9KiIHbg1ZR8k';
}

export function googleClientId() {
  return '185395226556-0oevpvnqdpebt6qqukrooemqet5kh3pb.apps.googleusercontent.com';
}

export function googleCalendarConfig() {
  const config = {
    CLIENT_ID:
      //   '185395226556-0oevpvnqdpebt6qqukrooemqet5kh3pb.apps.googleusercontent.com',
      '185395226556-5pg7o6kmaq3g186opqgl5f4gjll8pf6l.apps.googleusercontent.com',
    API_KEY: 'AIzaSyAclJIAm-8LUEgGfbnL4fS9KiIHbg1ZR8k',
    DISCOVERY_DOCS: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    ],
    SCOPES: 'https://www.googleapis.com/auth/calendar',
  };

  return config;
}
