import {
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import Swal from 'sweetalert2';
const db = firebaseDB();

export function handleMainImageUpload(imgFile, setMainImage, setUploadUserImg) {
  const reader = new FileReader();
  if (imgFile) {
    reader.readAsDataURL(imgFile);
  }

  reader.onload = function () {
    setMainImage(reader.result);
    if (setUploadUserImg) {
      setUploadUserImg(true);
    }
    return reader.result;
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
    return null;
  };
}

export async function addPlanToAllPlans(
  currentUserId,
  planDocRef, //createPlanDocId for add-new-plan
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

export async function saveToDataBase(
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
    Swal.fire('Successfully saved!');
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export function deleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => timeblock.id === id);
  let updateList = prev.splice(indexOfObject, 1);

  return prev;
}

export async function listenToSnapShot(setMyEvents, planDocRef) {
  const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

  onSnapshot(blocksListRef, (doc) => {
    doc.docChanges().forEach((change) => {
      if (change.type === 'added') {
        setMyEvents((prev) => [
          ...prev,
          {
            start: new Date(change.doc.data().start.seconds * 1000),
            end: new Date(change.doc.data().end.seconds * 1000),
            title: change.doc.data().title,
            id: change.doc.data().id,
            status: change.doc.data().status || '',
            place_format_address: change.doc.data().place_format_address,
            place_name: change.doc.data().place_name,
            place_id: change.doc.data().place_id,
            place_img: change.doc.data().place_img || '',
            place_url: change.doc.data().place_url,
            place_types: change.doc.data().place_types || '',
            place_formatted_phone_number:
              change.doc.data().place_formatted_phone_number || '',
            rating: change.doc.data().rating || '',
          },
        ]);
      }
      if (change.type === 'modified') {
        const id = change.doc.data().id;
        setMyEvents((prev) => [
          ...deleteBlockInMylist(prev, id),
          {
            start: new Date(change.doc.data().start.seconds * 1000),
            end: new Date(change.doc.data().end.seconds * 1000),
            title: change.doc.data().title,
            id: change.doc.data().id,
            status: change.doc.data().status || '',
            place_format_address: change.doc.data().place_format_address,
            place_name: change.doc.data().place_name,
            place_id: change.doc.data().place_id,
            place_img: change.doc.data().place_img || '',
            place_url: change.doc.data().place_url,
            place_types: change.doc.data().place_types || '',
            place_formatted_phone_number:
              change.doc.data().place_formatted_phone_number || '',
            rating: change.doc.data().rating || '',
          },
        ]);
      }
      if (change.type === 'removed') {
        const id = change.doc.data().id;
        setMyEvents((prev) => [...deleteBlockInMylist(prev, id)]);
      }
    });
  });
}

export async function getFavPlan(
  folderName,
  currentUserId,
  setFavPlansNameList
) {
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
}

export function renameGoogleMaDataIntoFirebase(location, placeId) {
  return {
    place_id: location.place_id || placeId,
    place_name: location.name,
    place_format_address: location.formatted_address,
    place_img: location.mainImg || location.photos[0].getUrl() || '',
    place_formatted_phone_number: location.formatted_phone_number || '',
    place_international_phone_number: location.international_phone_number || '',
    place_url: location.url,
    rating: location.rating || '',
    place_types: location.types || '',
    place_lat: location.geometry.location.lat(),
    place_lng: location.geometry.location.lng(),
    place_types: location.types || '',
  };
}
