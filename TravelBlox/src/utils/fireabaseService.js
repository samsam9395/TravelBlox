import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';

import Swal from 'sweetalert2';
import firebaseDB from './firebaseConfig';
import { renameGoogleMaDataIntoFirebase } from './functionList';

const db = firebaseDB();

async function addPlanToAllPlans(
  currentUserId,
  planDocRef,
  planTitle,
  mainImage,
  country,
  isPublished
) {
  try {
    const allPlansRef = doc(db, 'allPlans', planDocRef);

    await setDoc(
      allPlansRef,
      {
        author: currentUserId,
        plan_doc_ref: planDocRef,
        title: planTitle,
        main_image: mainImage,
        country: country,
        published: isPublished,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

async function addPlanToUserInfo(currentUserId, createPlanDocId) {
  try {
    const userInfoRef = doc(
      db,
      'userId',
      currentUserId,
      'own_plans',
      createPlanDocId
    );

    await setDoc(
      userInfoRef,
      {
        collection_id: createPlanDocId,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const firebaseService = {
  async createNewCollection(
    userInfo,
    username,
    startDateValue,
    endDateValue,
    planTitle,
    mainImage,
    country,
    isPublished
  ) {
    const currentTimeMilli = new Date().getTime();
    const createPlanDocId = `plan${currentTimeMilli}`;
    // setPlanDocRef(createPlanDocId);
    try {
      await setDoc(doc(db, 'plans', createPlanDocId), {
        author: userInfo.userEmail,
        author_name: username,
        start_date: startDateValue,
        end_date: endDateValue,
        title: planTitle,
        main_image: mainImage,
        published: false,
        planDocRef: createPlanDocId,
      });

      addPlanToUserInfo(userInfo.userEmail, createPlanDocId);

      addPlanToAllPlans(
        userInfo.userEmail,
        createPlanDocId,
        planTitle,
        mainImage,
        country,
        isPublished
      );

      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  },
  async getDefaultImg() {
    const docSnap = await getDoc(
      doc(db, 'main-components', 'default_plan_img')
    );
    return docSnap.data().default_plan_img;
  },
  async saveToDataBase(
    myEvents,
    planTitle,
    country,
    mainImage,
    planDocRef,
    startDateValue,
    endDateValue,
    isPublished
  ) {
    const batch = writeBatch(db);

    myEvents.forEach((singleEvent) => {
      const id = singleEvent.id;
      let updateRef = doc(db, 'plans', planDocRef, 'time_blocks', id);
      batch.update(updateRef, {
        end: singleEvent.end,
        start: singleEvent.start,
      });
    });

    const upperLevelUpdateRef = doc(db, 'plans', planDocRef);
    batch.update(upperLevelUpdateRef, {
      title: planTitle,
      country: country,
      main_image: mainImage,
      start_date: startDateValue,
      end_date: endDateValue,
      published: isPublished,
    });

    const allPlanRef = doc(db, 'allPlans', planDocRef);
    batch.update(
      allPlanRef,
      {
        title: planTitle,
        country: country,
        main_image: mainImage,
        published: isPublished,
      },
      { merge: true }
    );

    try {
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  },
  async listenToSnapShot(planDocRef, handleSnapShotData) {
    const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

    onSnapshot(blocksListRef, (docs) => {
      const newEventList = Object.keys(docs.docs).map((e) => {
        const {
          start,
          end,
          title,
          id,
          status,
          place_format_address,
          place_name,
          place_id,
          place_img,
          place_url,
          place_types,
          place_formatted_phone_number,
          rating,
        } = docs.docs[e].data();

        return {
          start: new Date(start.seconds * 1000),
          end: new Date(end.seconds * 1000),
          title: title,
          id,
          status: status || '',
          place_format_address,
          place_name,
          place_id,
          place_img: place_img || '',
          place_url,
          place_types: place_types || '',
          place_formatted_phone_number: place_formatted_phone_number || '',
          rating: rating || '',
        };
      });

      handleSnapShotData(newEventList);
    });
  },
  async getFavPlan(folderName, currentUserId, setFavPlansNameList) {
    const favRef = collection(db, 'userId', currentUserId, 'fav_plans');
    const planQuery = query(favRef, where('infolder', '==', folderName));

    try {
      const plansList = await getDocs(planQuery);
      const list = plansList.docs.map((e) => e.data());

      if (list.length === 0) {
        console.log('No fav plans yet!');
        setFavPlansNameList('');
      } else {
        setFavPlansNameList(list);
      }
    } catch (error) {
      console.log(error);
    }
  },
  addNewUserToDataBase(user, providerPlatform, username) {
    try {
      setDoc(doc(db, 'userId', user.email), {
        id: user.email,
        username: username || user.displayName,
        userImage:
          user.photoURL ||
          'https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/79/77/67/7977678c-89be-76ff-b9f3-cdc560170cb6/source/256x256bb.jpg',
        uid: user.uid,
        providerPlatform: providerPlatform,
      });
      setDoc(doc(db, 'userId', user.email, 'fav_folders', 'default'), {
        folder_name: 'My Default',
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async deletePlan(planDocRef, currentUserId) {
    const batch = writeBatch(db);
    const plansRef = doc(db, 'plans', planDocRef);
    const userInfoRef = doc(
      db,
      'userId',
      currentUserId,
      'own_plans',
      planDocRef
    );
    const allPlansRef = doc(db, 'allPlans', planDocRef);

    batch.delete(allPlansRef);
    batch.delete(plansRef);
    batch.delete(userInfoRef);

    try {
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error);
    }
  },
  addNewFavouriteFolder(currentUserId, newFolder) {
    try {
      setDoc(doc(db, 'userId', currentUserId, 'fav_folders', newFolder), {
        folder_name: newFolder,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async signUp(email, password, username) {
    const docRef = doc(db, 'userId', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return false;
      Swal.fire('You are a member already!');
    } else {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      firebaseService.addNewUserToDataBase(
        userCredential.user,
        'firebase_native',
        username
      );
    }
  },
  async getUserName(userEmail) {
    const userDoc = await getDoc(doc(db, 'userId', userEmail));
    if (userDoc.data().username) {
      return userDoc.data().username;
    }
  },
  async getEditDetailData(planDocRef) {
    const docSnap = await getDoc(doc(db, 'plans', planDocRef));
    return docSnap.data();
  },
  async getPublishedPlans() {
    const allPlansRef = collection(db, 'allPlans');
    const q = query(allPlansRef, where('published', '==', true));
    const allPlans = await getDocs(q);

    if (allPlans.docs.length === 0) {
    } else {
      return allPlans.docs.map((e) => e.data());
    }
  },
  async getOwnPlans(userEmail) {
    const ref = collection(db, 'userId', userEmail, 'own_plans');
    const plansList = await getDocs(ref);

    if (plansList.docs.length === 0) {
      return false;
    } else {
      const list = [];
      plansList.forEach((plan) => {
        list.push(plan.data().collection_id);
      });

      return list;
    }
  },
  async getUserBasicInfo(userEmail) {
    try {
      const userDoc = await getDoc(doc(db, 'userId', userEmail));
      return userDoc.data();
    } catch (error) {
      console.log(error);
    }
  },
  saveImgToDataBase(userImage, userEmail) {
    try {
      setDoc(
        doc(db, 'userId', userEmail),
        {
          userImage: userImage,
        },
        { merge: true }
      );

      Swal.fire('Saved your image!');
    } catch (error) {
      console.log(error);
    }
  },
  async signOutFirebase() {
    const auth = getAuth();

    return signOut(auth)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  },
  async updateExpiredGoogleImgToDataBase(timeBlockRef, renewGoogleImgUrl) {
    await setDoc(
      timeBlockRef,
      {
        timeEdited: new Date(),
        place_img: renewGoogleImgUrl,
      },
      {
        merge: true,
      }
    );
  },
  async updateToDataBase(
    timeBlockRef,
    blockTitle,
    description,
    startTimeValue,
    endTimeValue,
    location,
    timeBlockImage,
    placeId
  ) {
    if (location.geometry) {
      const googleLocationData = renameGoogleMaDataIntoFirebase(
        location,
        placeId
      );

      try {
        await setDoc(
          timeBlockRef,
          {
            title: blockTitle,
            text: description,
            start: startTimeValue,
            end: endTimeValue,
            timeblock_img: timeBlockImage || '',
            ...googleLocationData,
            status: 'origin',
            timeEdited: new Date(),
          },
          {
            merge: true,
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      try {
        await setDoc(
          timeBlockRef,
          {
            title: blockTitle,
            text: description,
            start: startTimeValue,
            end: endTimeValue,
            timeblock_img: timeBlockImage || '',
            status: 'origin',
            timeEdited: new Date(),
            place_img: location.mainImg || '',
          },
          {
            merge: true,
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  },
};

export default firebaseService;
