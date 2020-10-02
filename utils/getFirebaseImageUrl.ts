
export const getFirebaseImageUrl = (key: string, imageToken: string) => {
    return `https://firebasestorage.googleapis.com/v0/b/dinder-21708.appspot.com/o/images%2F${key}.jpg?alt=media&token=${imageToken}`
}