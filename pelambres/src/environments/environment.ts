// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // urlBase: 'https://sms-admin.tmsgo.cl/',
  //urlBase: 'http://127.0.0.1:8000/',
  urlBase: 'http://localhost:8000/',
  //token: 'fa791cda3ab89d58209fe408443618cace557043',
  menu: 'main',
  app: 'sms-app',  
  mapBoxToken: 'pk.eyJ1Ijoiam1hcnF1ZXo4MiIsImEiOiJja2ZnaWtrdWQwcDE1MnhsbTZoYjRoandoIn0.SdVAGMVrkTRUoPN-ACVDrw',
  firebaseConfig: {
    apiKey: "AIzaSyCoMHNd3jaMInou6Xb4fKRPz-NP_teqHE4",
    authDomain: "logics-e795d.firebaseapp.com",
    databaseURL: "https://logics-e795d.firebaseio.com",
    projectId: "logics-e795d",
    storageBucket: "logics-e795d.appspot.com",
    messagingSenderId: "177530559697",
    appId: "1:177530559697:web:52881de074e431s723c79f0",
    measurementId: "G-STB7LXMNV5"
  },
  filePath: 'https://storage.googleapis.com/tms-go/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
