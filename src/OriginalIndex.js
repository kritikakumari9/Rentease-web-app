import { initializeApp } from 'firebase/app'

import{ 
    getAuth,
createUserWithEmailAndPassword,
signOut , signInWithEmailAndPassword , 
onAuthStateChanged} from 'firebase/auth'

import{collection, getFirestore, getDocs ,addDoc, deleteDoc , doc, onSnapshot
  , query , where
  , orderBy, serverTimestamp,
  getDoc, updateDoc, DocumentSnapshot } from 'firebase/firestore'

  import { getStorage , ref, uploadBytes , getDownloadURL , deleteObject} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAZz0wB9ZLA8-wiJ8R79l_FRqHStCQpeKo",
    authDomain: "rentease-web-app.firebaseapp.com",
    projectId: "rentease-web-app",
    storageBucket: "rentease-web-app.appspot.com",
    messagingSenderId: "325112615368",
    appId: "1:325112615368:web:8230fd795b1f34565af0fd"
  }

  // let LoggedIn=0;

  // initializes  firebase app
initializeApp(firebaseConfig)


// signing users up
const auth=getAuth() 
// initializing authentication services
// authentication object
// login below


const signupForm = document.querySelector('.signup')
 if(signupForm!=null){
  // above condition important because in login form above element = null and if below code runs inspite of sigupForm being null then it will not execute 
  // because of Cannot read properties of null error 
signupForm.addEventListener('submit',(e)=> {
  e.preventDefault()
  const email= signupForm.email.value
  const password=signupForm.password.value

 createUserWithEmailAndPassword(auth , email , password)
//  it takes 3 arguments 1st is authentication object , 2nd is email entered by user , 3rd is password entered by user
 // it is asymchronous therefore takes some time to do and it returns a promise so we can tack 
 // on a then method which fires a function when this action is complete 
 .then((cred) => {
  //once it signed a user up over here we get user credential back of that user
  // who just signed in so we can take that into Callback function = fumction inside then() . we get user credential back as cred = user credential object and on that credential object we have access to the user that just signed up
  // and that cred is passed as an argument to then()
//  console.log('user created:' , cred.user)
 // we use user property of cred object to get access to that user
  const SignUpFormOuterBox=document.querySelector('.box1')
  SignUpFormOuterBox.style.display='none'

  const signUpSuccessMsgBox=document.querySelector('.box2')
  signUpSuccessMsgBox.style.display='flex'

 const SignOutNav=document.querySelector('.nav-signout')
SignOutNav.style.display='flex'

const SignInNav=document.querySelector('.nav-signin')
SignInNav.style.display='none'

addDoc(UserInfocolRef, {
  UID:uid ,
 email:signupForm.email.value , 
  name: signupForm.name.value,
  // on using createAt:serverTimestamp() we get two new snapshots  therefore 2 outputs simultaneously, why is that I don't know 
phone:signupForm.phone.value,

})

 signupForm.reset()
 
 

 })

 .catch((err) => {
 alert(err.message)
})

})
 }



// login below


const loginForm=document.querySelector(".login")
if(loginForm!=null){
loginForm.addEventListener('submit' , (e)=>{

  e.preventDefault()

  const email=loginForm.email.value
  const password=loginForm.password.value

  signInWithEmailAndPassword(auth,email,password)
  // below code explanation same as signing user up 
  .then((cred)=>{
    // console.log("user logged in", cred.user)
    // we use user property of cred object
  
    const SignInFormOuterBox=document.querySelector('.box1')
  SignInFormOuterBox.style.display='none'

  const signInSuccessMsgBox=document.querySelector('.box2')
  signInSuccessMsgBox.style.display='flex'

    const SignOutNav=document.querySelector('.nav-signout')
SignOutNav.style.display='flex'

const SignInNav=document.querySelector('.nav-signin')
SignInNav.style.display='none'
    loginForm.reset()

  })
  
  .catch((err)=>{
    // console.log(err.message)
    alert(err.message)
  })
})
}


// logout below
 
const logoutButton = document.querySelector(".logOutBtn")
if(logoutButton!=null){
logoutButton.addEventListener('click' , ()=>{
  // note here event = click and not submit because we are clicking the button and not submitting the form
signOut(auth)
// it is  asynchronous therefore returns a promise 
 .then(()=>{
 
const LogOutBtnOuterBox=document.querySelector('.box1')
LogOutBtnOuterBox.style.display='none'

const LogOutSuccessMsgBox=document.querySelector('.box2')
LogOutSuccessMsgBox.style.display='flex'


 const SignOutNav=document.querySelector('.nav-signout')
SignOutNav.style.display='none'

const SignInNav=document.querySelector('.nav-signin')
SignInNav.style.display='flex'
 

})
.catch((err)=>{
  alert(err.message)
})
})
}





onAuthStateChanged(auth , (user) =>{
  console.log("user status changed" , user)
  // user = user who just logged in or signed up and user = null if user log out
  // in login or sign up case entire information is displayed as [user object] which is depicted by user variable and
  //  user = null in logout case 
  
 
// 
  const signInNav=document.querySelector('.nav-signin')
  const signOutNav=document.querySelector('.nav-signout')
  const rentNav=document.querySelector('.nav-rent')
  const RentalItemFormElem=document.querySelector('.RentalItemsFormBox')
  const signInAlertElem=document.querySelector('.signInAlertBox')
  const RentalItemListElem=document.querySelector('.RentalItemList')
  if(user!=null){
    uid=user.uid;
    // write above line here only and not outside if block or it shows wrong nav-bar in rent.html
    signInNav.style.display='none'
    signOutNav.style.display='flex'
   
    if(RentalItemFormElem!=null){
      // all the below three elements are in same webpage if any one is null
      // that means all other 2 are also null i.e. that webpage is not opened
      // therefore in above condition i used only 1 element
    RentalItemFormElem.style.display='flex';
    signInAlertElem.style.display='none';

    RentalItemListElem.style.display='flex';
    }

   
  }  

  if(user==null){
    
    signInNav.style.display='flex'
    signOutNav.style.display='none'
    
    if(RentalItemFormElem!=null){
    RentalItemFormElem.style.display='none'
    signInAlertElem.style.display='flex'

    RentalItemListElem.style.display='none'
    }
    }

 
})

// Firestore code below
var uid;
// we invoke getFirestore() function to initialize services
const db = getFirestore()
// database object
// this constant db is now basically connection to our database which we can use to get 
// data from databse and more such stuff

// below is code for Rent.html
const RentalItemscolRef = collection(db, 'RentalItems')
const UserInfocolRef=collection(db,'UserInfo')



const rentalItemForm=document.querySelector('.RentalItem');
if(rentalItemForm!=null){
rentalItemForm.addEventListener('submit',(e) =>{
  e.preventDefault();
  ListIteration=0;
  listElem=document.createElement('ul')
  addDoc(RentalItemscolRef, {
    itemInfo:rentalItemForm.info.value ,
    itemName:rentalItemForm.name.value , 
    itemPicURL: URL,
    UID:uid,
    AvailabilityStatus:'Available'
})

.then(() => {
  
   const DetSucSubBoxElem=document.querySelector('.DetSubSucBox')

 
   const rentalItemFormBoxElem=document.querySelector('.RentalItemsFormBox')
   rentalItemFormBoxElem.style.display='none'
   DetSucSubBoxElem.style.display='flex'
  //  below code will show details submitted success mssg for 5 seconds
   setTimeout(function(){
    DetSucSubBoxElem.style.display='none';
   }, 5000)
   setTimeout(function(){
    location.reload()
    // to refresh the pafe after 5.5 seconds so that new list is visible in
    // list
   },5500)

  //  below code will display nothing in image element after details is submitted if not written this
  // then the upload item image is shown even when the details form is submitted
   const img = document.getElementById('Itemimg');
   img.setAttribute('src', "");
  rentalItemForm.reset()
    // to reset add book form  
    // location.reload()
})

.catch((err) => {
  // if('Missing or insufficient permissions'.localeCompare(err.message)==0){
    const uploadImgMsgElem=document.querySelector('.uploadImgMsg')
    uploadImgMsgElem.style.display='flex'
  console.log(err.message)
  // }
})

  })
}

// setting ListIteration to keep contreol over how many times value is added to list
// if not used this then everytime we clik showListBtn it adds the existing values agian in the list
// and hence lsit shows same repeating value 
  var ListIteration=0;
  var listElem=document.querySelector('.List');
// below code to display list of rental items of individual users
const ShowListBtnElem=document.querySelector('.ShowListBtn')
if(ShowListBtnElem!=null){
ShowListBtnElem.addEventListener('click' , (e)=>{
 ListIteration+=1;
  const HideListBtnElem=document.querySelector('.HideListBtn')
 HideListBtnElem.style.display='flex'
 ShowListBtnElem.style.display='none'
  
 
  const ListBoxElem=document.querySelector('.ListBox')
  ListBoxElem.style.display='flex'
 

  const q1=query(RentalItemscolRef, where('UID','==',uid))
  // this query is used to get data for specific authenticated user
  

  onSnapshot(q1,(snapshot)=>{
    // we store unsubscribe function returned from onSnapshot() to unsubscribe from its subscription
    let list = []
    snapshot.docs.forEach(doc => {
      list.push({ ...doc.data(), id: doc.id })
      
})

// below condition important or elese everytime you will click on
// show list btn it will add values to the list and the same values of list will 
// be repeated 
const tableBody=document.createElement('tbody') 
tableBody.classList.add('tableBody')
if (ListIteration==1){
 list.forEach((e)=>{
 
  const tableRow=document.createElement('tr')
   tableRow.classList.add('tableRow')
    const td1=document.createElement('td')
    td1.classList.add('List')
    const listElem=document.createElement('li')
    listElem.innerText=e.itemName
    const td2=document.createElement('td')
    td2.classList.add('Availability')
    
     td2.innerText="rem "
     td1.append(listElem)
  //     tableRow.append(td1,td2,DelBtn)
  //    tableBody.appendChild(tableRow)
  //  ListBoxElem.appendChild(tableBody)

 let DelBtn=document.createElement('button')
 DelBtn.innerText="Remove"
 DelBtn.classList.add('DelBtn')
 DelBtn.addEventListener('click' , ()=>{
  tableBody.style.display='none'
  // because of above line on clicking remove btn that row is hidden 
  // if not used then after clicking remove btn in table remaining values repeat
 
 let docRef=doc(db,'RentalItems' , e.id)
 deleteDoc(docRef)
 .then(()=>
 {
  const RentalItemListElem=document.querySelector('.RentalItemList')
  const RemItemSucBoxElem=document.querySelector('.RemItemSucBox')
  RentalItemListElem.style.display='none'
  RemItemSucBoxElem.style.display='flex'
 //  below code will show item deleted success mssg for 3 seconds
 setTimeout(function(){
 RemItemSucBoxElem.style.display='none';
 }, 3000)
 setTimeout(function(){
  location.reload()
  // to refresh the pafe after 3.5 seconds so that new list is visible in
  // list
 },3500)
  
 })
 .catch((err) => {
  // if('Missing or insufficient permissions'.localeCompare(err.message)==0){
  console.log(err.message)
  // }
})

 })

    tableRow.append(td1,td2,DelBtn)
   tableBody.appendChild(tableRow)
 ListBoxElem.appendChild(tableBody)
   
  
 })
 }

  })

 })

 }

const HideListBtnElem=document.querySelector('.HideListBtn')
if(HideListBtnElem!=null){
  HideListBtnElem.addEventListener('click' , (e)=>{
   const ShowListBtnElem=document.querySelector('.ShowListBtn')
   const ListBoxElem=document.querySelector('.ListBox')
   ListBoxElem.style.display='none'
   HideListBtnElem.style.display='none'
   ShowListBtnElem.style.display='flex'
    
    
    e.preventDefault();
    // prevent default action i.e. refresh of the page

    
  
   
  
  })
  
 }

 // below code for search bar working

 var val;
let list=[]
let listIteration=0
 const searchInputFormElem=document.querySelector('.searchInputForm')
   searchInputFormElem.addEventListener('submit' , (e)=>{
    const RentalItemAnimation1=document.querySelector('.RentalItems-section1')
    RentalItemAnimation1.style.display='none'
    const RentalItemAnimation2=document.querySelector('.RentalItems-section2')
    RentalItemAnimation2.style.display='none'
     e.preventDefault();
     const flexContainer=document.querySelector('.flex-container')
    //  below code deletes the previously added images in flex box so that they are not 
    // reshown with new search images
     while (flexContainer.firstChild) {
      flexContainer.removeChild(flexContainer.firstChild);
    }
     let list=[];
    //  this list comprises of download url link for images  
    

    val= searchInputFormElem.searchInput.value
   
    const q2=query(RentalItemscolRef ,where('itemName','==',val)) 
    

    getDocs(q2)
  .then(snapshot => {
    // console.log(snapshot.docs)
    //docs property of snapshot object represents all of the documents
    // snapshot.docs is basically an array that contains documents as an array with its 1 item being object representing all information about that respective document
    
    snapshot.docs.forEach(doc => {
    //  list.push({ ...doc.data(), id: doc.id })
    list.push(doc.data())
      // push functions adds element to the end of array 
    })
   
    // books is basically array of objects comprising of document data as key - value pair alongwith additional key-value pair of its id
    
    // arrayName.forEach (functionName) calls a function for each element in an array
    // snapshot.docs returns an array of all the document in our collection in firestore
    // here we have declared books as an array which will basically store object comprising of data of individual document and  its respective id
    // doc.data() returns object comprising of our data stored in our document with field of docu as key of obj and value of docum as value of key
    //... doc.data() cretes shallow copy of object doc.data() and further we add one more key value pair of id of document in our that object
  searchInputFormElem.reset()
  if(list.length==0){
    const NoItemFndBoxElem=document.querySelector('.NoItemFndBox')
    NoItemFndBoxElem.style.display='flex'
  }
  else{
    console.log(list)
    const NoItemFndBoxElem=document.querySelector('.NoItemFndBox')
    NoItemFndBoxElem.style.display='none'

    // below code creates flexbox with boxes depending on how much items info is available for particular search
    
    list.forEach((e)=>{
    let  Box = document.createElement("div");
     let  Box1=document.createElement('div');
  //   let  img = document.createElement('img');
  // img.setAttribute('src', e);
  const q3=query(UserInfocolRef ,where('UID','==',e.UID)) 
  getDocs(q3)
  .then(snapshot => {
    // console.log(snapshot.docs)
    //docs property of snapshot object represents all of the documents
    // snapshot.docs is basically an array that contains documents as an array with its 1 item being object representing all information about that respective document
     let l=[]
    snapshot.docs.forEach(doc => {
    //  list.push({ ...doc.data(), id: doc.id })
    l.push(doc.data())
      // push functions adds element to the end of array 
    })
    l.forEach((e)=>{
      let OwnerHead=document.createElement('h4')
      OwnerHead.innerText='Ownwer Details'

      let pName=document.createElement('p')
      pName.innerText="Owner name: " + e.name

      let pE=document.createElement('p')
      pE.innerText="Owner email: " + e.email

      let pP=document.createElement('p')
      pP.innerText="Owner phone number: " + e.phone
      // things added here appears at last in flex box
     let Breakline1=document.createElement('br')
     let Breakline2=document.createElement('br')
     let Breakline3=document.createElement('br')
    //  Box.append(OwnerHead,pName, pE, pP)
    Box.appendChild(OwnerHead)
    Box.appendChild(Breakline1)
    Box.appendChild(pName)
    Box.appendChild(Breakline2)
    Box.appendChild(pE)
    Box.appendChild(Breakline3)
    Box.appendChild(pP)
    })

  })

      Box.classList.add('Box')
      // Box.style.height='20rem'; 
      
      const imageElement = document.createElement("img");
      imageElement.setAttribute('src', e.itemPicURL);
      imageElement.style.height='20rem'
      imageElement.style.width='100%'
      Box1.style.height='relative'
      Box1.appendChild(imageElement)
      Box.appendChild(Box1)

      let itemHead=document.createElement('h4')
      itemHead.innerText='Item Details'
      let Breakline1=document.createElement('br')
      let pItemN=document.createElement('p')
      pItemN.innerText="Item name: " + e.itemName
      let Breakline2=document.createElement('br')
      
      let pI=document.createElement('p')
      pI.innerText="Item information: "+e.itemInfo

      let pAvail=document.createElement('p')
      pAvail.innerText="Availability status: " + e.AvailabilityStatus
      
      let Breakline3=document.createElement('br')
      let Breakline4=document.createElement('br')
      let Breakline5=document.createElement('br')
           // things added here appears as first elements then come what 
  // we have added up
  
  Box.append(itemHead, Breakline1 ,pItemN,Breakline2,pI,Breakline3,pAvail, Breakline4 )
                    
      flexContainer.appendChild(Box)
      
    })
    
  }
  
  console.log(list.length);
  })
  .catch(err => {
    // if any other error also then also it shows same signInAlertBox error 
    searchInputFormElem.reset()
    const signInAlertBox=document.querySelector('.signInAlertBox')
    signInAlertBox.style.display='flex';
    console.log(err.message)
  })

  })
   



  // Firebase Storage
  // / Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();
  // storage object
  var pathGlobal=null;
  var URL;

  // get dom in variables
  var upload=document.getElementsByClassName('upload')[0];
  var hiddenBtn=document.getElementsByClassName('hidden-upload-btn')[0];


  // create function for select a file
  if(upload!=null){
   upload.addEventListener('click', (e)=>{
   e.preventDefault()
   hiddenBtn.click()// hiddenBtn=hidden-upload-btn is not displayed
    // clicking upload button will also click it thus drop down will appear
    // to select photos
    })
  }
//  above code is equivalent to 
// upload.onclick=function(){hiddenBtn.click();}

// get selected files and upload function
// instead of using addEventListener we can also use like below:
if(hiddenBtn!=null){
hiddenBtn.onchange=function(){
  // The change event occurs when the value of an element has been changed (only works on <input>, <textarea> and <select> elements).
  // that is if you select same file(image mostly) again in <input type = 'file'> case
  // then there will be no change hence this code will not be executed
  // get file
  var file=hiddenBtn.files[0]
  // file object

  var name=file.name
  // name property of file object
  console.log(name)

  var type=file.type.split('/')[0]
  var path=type + '/' + name;
  pathGlobal=path // saving path to global variable so that it can be accessed globally
  // as its required to delete the file outside this function
  console.log(file.type)
  const storageRef=ref(storage, path)
  
  
  // uploading photo in firebase
  uploadBytes(storageRef,file)
  .then((snapshot) =>
  {
   


// downloading photo from firebase 
getDownloadURL(ref(storage, path))

.then((url) => {
 
  URL=url;
  
 
  const img = document.getElementById('Itemimg');
  img.setAttribute('src', url);
})
.catch((error) => {
  
  console.log(error.message)
})
  
})
}
}