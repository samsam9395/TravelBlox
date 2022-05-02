import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

export function handleMainImageUpload(e, setMainImage) {
  console.log(e.target.files[0]);
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    // console.log(reader.result); //base64encoded string
    setMainImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
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
  console.log(200, planDocRef);

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
    alert('Successfully saved!');
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export function deleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => {
    return timeblock.id === id;
  });
  let updateList = prev.splice(indexOfObject, 1);

  return prev;
}

export async function listenToSnapShot(setMyEvents, planDocRef) {
  const blocksListRef = collection(db, 'plans', planDocRef, 'time_blocks');

  onSnapshot(blocksListRef, (doc) => {
    doc.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // console.log(myEvents);
        // console.log(change.doc.data());
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
        console.log('Modified time: ', change.doc.data());
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
        console.log('Removed time: ', change.doc.data());
        const id = change.doc.data().id;
        setMyEvents((prev) => [...deleteBlockInMylist(prev, id)]);
      }
    });
  });
}
