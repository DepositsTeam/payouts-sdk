# Deposits Payouts Web SDK
The payouts SDK is Deposits' all-in-one, plug and play, mass payment management system.


### Getting Started
You have to install the SDK via npm.
```shell
$ npm install @deposits/payouts-sdk
```

### Examples
We have created examples to guide you in sandbox and in production.

##### Example in sandbox
```sh
https://api.deposits.dev/example/payouts
```
##### Example in production
```sh
https://api.ondeposits.com/example/payouts
```

### How to use
The SDK exports a function `DepositsPayouts` that can be used to initiate the Deposits balance experience.

```js
import DepositsPayouts from "@deposits/payouts-sdk"

DepositsPayouts({
   public_key,
   redirect_url: "https://ondeposits.com",
   callback: (data) => {
        console.log("callback", data);
    },
})
```

After importing the `DepositsPayouts` function, we can trigger it as show in the example above. When the function is called, it triggers the Deposits Payouts experience and initiates it on your application.

#### The `DepositsPayouts` Object Argument
The `DepositsPayouts` function accepts an argument, which is an object containing information needed to run the Payouts experience.

| Property         | Description                                                                                                                      |
|------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `public_key`     | The public key of your teanant that can be found on the [console](https://dev.launch.new).                                       |
| `callback`       | A function that gets called when various events happen. The function would accept an object containing the event type and action |
| `production_env` | A boolean flag that determines whether the SDK would run in our production or sandbox environment.                               |


## Contributing

Only members of the deposits team can contribute to this. You can create an issue if you find a bug or have any challenge using this SDK.
