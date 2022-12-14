# supertokens-naver-provider

[![Publish Package to npmjs](https://github.com/eunchurn/supertokens-naver-provider/actions/workflows/publish.yml/badge.svg)](https://github.com/eunchurn/supertokens-naver-provider/actions/workflows/publish.yml) ![npm](https://img.shields.io/npm/dw/supertokens-naver-provider) ![npm](https://img.shields.io/npm/v/supertokens-naver-provider) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/supertokens-naver-provider?label=size) [![Depfu](https://badges.depfu.com/badges/bec792b89a90e3ef64d6733e18bd5671/count.svg)](https://depfu.com/github/eunchurn/supertokens-naver-provider?project_id=37164) ![GitHub issues](https://img.shields.io/github/issues/eunchurn/supertokens-naver-provider) ![NPM](https://img.shields.io/npm/l/supertokens-naver-provider)

Naver providers for SuperTokens

[SuperTokens](https://supertokens.com)애서 간편 로그인의 Naver Custom provider를 제공합니다.

## Usage

### Express Backend: Naver SignIn and SignUp

```typescript
import supertokens from "supertokens-node";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { Naver } from "supertokens-naver-provider";

superTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "http://your-auth-domain.com",
    apiKey: "your-secret-key",
  },
  appInfo: {
    appName: "your-auth-app-name",
    apiDomain: "https://your-api-domain.com",
    websiteDomain: "https://your-web-client-domain.com",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        Naver({
          clientId: process.env.NAVER_ACCESS_KEY,
          clientSecret: process.env.NAVER_ACCESS_SECRET,
          relativeRedirectUrl: "/auth/callback/naver",
        }),
      ],
    }),
  ],
});
```

### Client

#### SignInAndUp click handler function

<https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/thirdparty-login#step-1-redirecting-to-social--sso-provider>

```typescript
import ThirdPartyEmailPassword, {
  getAuthorisationURLWithQueryParamsAndSetState,
} from "supertokens-web-js/recipe/thirdpartyemailpassword";

enum ThirdPartyId {
  kakao = "kakao",
  naver = "naver", // use this
}

SuperTokens.init({
  appInfo: {
    appName: "your-auth-app-name",
    apiDomain: "https://your-api-domain.com",
    apiBasePath: "/auth",
  },
  recipeList: [ThirdPartyEmailPassword.init({}), Session.init()],
});

export const signInClicked = (thirdPartyId: ThirdPartyId) => async () => {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      providerId: thirdPartyId,
      authorisationURL: `${process.env.REACT_APP_HOST_URL}/auth/callback/${thirdPartyId}`,
    });
    window.location.assign(authUrl);
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert("Oops! Something went wrong.");
    }
  }
};
```

#### Redirected page handler: Auth callback

<https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/thirdparty-login#step-2-handling-the-auth-callback-on-your-frontend>

```typescript
import { thirdPartySignInAndUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";

async function handleGoogleCallback() {
  try {
    const response = await thirdPartySignInAndUp();

    if (response.status === "OK") {
      console.log(response.user);
      if (response.createdNewUser) {
        // sign up successful
      } else {
        // sign in successful
      }
      window.location.assign("/home");
    } else {
      // SuperTokens requires that the third party provider
      // gives an email for the user. If that's not the case, sign up / in
      // will fail.

      // As a hack to solve this, you can override the backend functions to create a fake email for the user.

      window.alert(
        "No email provided by social login. Please use another form of login",
      );
      window.location.assign("/auth"); // redirect back to login page
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert("Oops! Something went wrong.");
    }
  }
}
```
