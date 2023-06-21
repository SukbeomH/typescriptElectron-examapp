# Electron Exam App for Remote Testing

electron forge is used to create the app. 
using Typescript for the main process

## Features

- Background Process Detection and Prevention
- Remote Testing URL can be set, By adding 'property.ts' file in the root/src directory (Using property.ts.example)
- Prevents user from opening other apps
- Disallows user Capturing Screen, Taking Screenshots, Recording Screen
- Configure the Multiple URL for the Exam
- Build and Package the App for Windows and Mac

## Todo

- Auto Update
- Code Signing

## How to use

- Clone the repo
- Run `yarn` to install dependencies
- Run `yarn start` to start the app in development mode
- Run `yarn make` to build the app for your platform

## License

MIT