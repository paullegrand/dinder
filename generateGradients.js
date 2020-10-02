const firebase    = require('firebase/app')
const GetColors   = require('get-image-colors')
const Axios       = require('axios')
const fs          = require('fs')

require('firebase/database')
require('firebase/auth')

const firebaseConfig = {
  apiKey: 'AIzaSyDAXDShwT-7KmE-zxy2eit-G74eS2Z-DXQ',
  authDomain: 'dinder-21708.firebaseapp.com',
  databaseURL: 'https://dinder-21708.firebaseio.com',
  projectId: 'dinder-21708',
  storageBucket: 'dinder-21708.appspot.com',
  messagingSenderId: '521917031410',
  appId: '1:521917031410:web:35b7a7ae0ac5711a25416b',
  measurementId: 'G-DK6Q58YNMT',
}

firebase.initializeApp(firebaseConfig)

const db = firebase.database()
const ref = db.ref('/foods')

const getImageUrls = new Promise((resolve, reject) => {
  let imageUrls = []

  ref.on("value", (snapshot) => {
    const foods = snapshot.val()

    for (const [key, value] of Object.entries(foods)) {
      const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}`

      imageUrls.push({
        url: `${bucketUrl}/o/images%2F${key}.jpg?alt=media&token=${value.imageToken}`,
        name: value.name
      })
    }

    return resolve(imageUrls)
  }, (err) => {
    console.error('The read failed: ' + err.code)

    return reject(err.code)
 })
})

// https://stackoverflow.com/questions/55374755/node-js-axios-download-file-stream-and-writefile
async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return Axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {

    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}


const requestGenerateGradients = new Promise((resolve, reject) => {
  fs.promises.mkdir('images', { recursive: true })

  getImageUrls.then((images) => {
    images.map(image => {
      const imagePath = 'images/' + image.name + '.jpg'
      downloadFile(image.url, imagePath)
        .then(() => {
          GetColors(imagePath)
            .then(colors => {
              const hex = colors.map(color => color.hex())

              console.log(`colors for ${image.name}: `, hex)
              // @TODO: we could make this sync to the db auto here...
              // Or just do it manually for now
            })
        })
    })
  })
  .catch((err) => {
    console.error('Unable to get image URLs from Firebase', err)

    return reject()
  })
})

requestGenerateGradients.then(() => {
  // ...
}).catch(e => {
  console.error(e)
}).finally(() => {
  return process.exit(0)
})
