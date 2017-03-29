import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { setStatusBarColors } from "./utils/status-bar-util";
import { AppModule } from "./app.module";
import * as tnsOAuthModule from 'nativescript-oauth';
var facebookInitOptions: tnsOAuthModule.ITnsOAuthOptionsFacebook = {
    clientId: '1287476194673240',
    clientSecret: '3dfc46b18cbdb5abfdcd23175ff8623e',
    scope: ['email','user_friends','public_profile']
};
tnsOAuthModule.initFacebook(facebookInitOptions);
setStatusBarColors();
platformNativeScriptDynamic().bootstrapModule(AppModule);
