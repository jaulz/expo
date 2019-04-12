'use strict';

import { Platform, NativeModules } from 'react-native';
import { Constants } from 'expo';

const { ExponentTest } = NativeModules;

function browserSupportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return (
      !!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// List of all modules for tests. Each file path must be statically present for
// the packager to pick them all up.
export function getTestModules() {
  if (Platform.OS === 'web') {
    const modules = [
      require('./tests/Import1'),
      require('./tests/Crypto'),
      require('./tests/Random'),
    ];

    if (browserSupportsWebGL()) {
      modules.push(require('./tests/GLView'));
    }
    return modules;
  }

  const modules = [
    require('./tests/Basic1'),
    require('./tests/Basic2'),
    require('./tests/Import1'),
    require('./tests/Import2'),
    require('./tests/Import3'),
    require('./tests/Asset'),
    require('./tests/Audio'),
    require('./tests/Constants'),
    require('./tests/Crypto'),
    require('./tests/FileSystem'),
    require('./tests/GLView'),
    require('./tests/Haptics'),
    require('./tests/Localization'),
    require('./tests/Recording'),
    require('./tests/ScreenOrientation'),
    require('./tests/SecureStore'),
    require('./tests/Segment'),
    require('./tests/Speech'),
    require('./tests/SQLite'),
    require('./tests/Random'),
    require('./tests/Payments'),
    require('./tests/AdMobInterstitial'),
  ];
  if (!ExponentTest.isInCI) {
    // Requires interaction (sign in popup)
    modules.push(require('./tests/GoogleSignIn'));
    // Popup to request device's location which uses Google's location service
    modules.push(require('./tests/Location'));
    // Fails to redirect because of malformed URL
    modules.push(require('./tests/Linking'));
    // Requires permission
    modules.push(require('./tests/Calendar'));
    modules.push(require('./tests/Contacts'));
    modules.push(require('./tests/Permissions'));
    modules.push(require('./tests/MediaLibrary'));
    modules.push(require('./tests/Notifications'));
    if (Constants.isDevice) modules.push(require('./tests/Brightness'));
    // Crashes app when mounting component
    modules.push(require('./tests/AdMobBanner'));
    modules.push(require('./tests/AdMobPublisherBanner'));
    modules.push(require('./tests/AdMobRewarded'));
    modules.push(require('./tests/Video'));
    modules.push(require('./tests/FBBannerAd'));
    modules.push(require('./tests/FBNativeAd'));
    modules.push(require('./tests/TaskManager'));
  }
  if (Platform.OS === 'android') modules.push(require('./tests/JSC'));
  if (Constants.isDevice) {
    modules.push(require('./tests/BarCodeScanner'));
    // The Camera tests are flaky on iOS, i.e. they fail randomly
    if (Platform.OS === 'android') modules.push(require('./tests/Camera'));
  }
  return modules;
}

export async function acceptPermissionsAndRunCommandAsync(fn) {
  if (!ExponentTest) {
    return await fn();
  }

  const results = await Promise.all([
    ExponentTest.action({
      selectorType: 'text',
      selectorValue: 'Allow',
      actionType: 'click',
      delay: 1000,
      timeout: 100,
    }),
    fn(),
  ]);

  return results[1];
}

export async function shouldSkipTestsRequiringPermissionsAsync() {
  if (!ExponentTest || !ExponentTest.shouldSkipTestsRequiringPermissionsAsync) {
    return false;
  }
  return ExponentTest.shouldSkipTestsRequiringPermissionsAsync();
}
