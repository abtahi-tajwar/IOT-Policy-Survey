import app from "./init";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { SceneGetType } from "../interfaces/SceneType";


export function getAll() {
    return new Promise<Array<SceneGetType>>(async (resolve, reject) => {
        const db = getFirestore(app);
        const q = query(collection(db, "scenarios"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        let result : Array<SceneGetType> = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const docData = doc.data()
            const obj: SceneGetType = {
                id: doc.id,
                data: {
                    name: docData.name,
                    order: docData.order,
                    instruction_markdown: docData.instruction_markdown,
                    scenario_markdown: docData.scenario_markdown,
                    active: docData.active
                }
            }
            
            // obj.data.instruction_markdown = await downloadAndReadFile(doc.data().instruction_markdown)
            // obj.data.scenario_markdown = await downloadAndReadFile(doc.data().scenario_markdown)
            result.push(obj)
        });
        result = await Promise.all(result.map(async (obj) => {
            const instruction_markdown: string = await downloadAndReadFile(obj.data.instruction_markdown)
            const scenario_markdown: string = await downloadAndReadFile(obj.data.scenario_markdown)
            // console.log("Instruction MD", instruction_markdown)
            return {
                ...obj,
                data: {
                    ...obj.data,
                    instruction_markdown,
                    scenario_markdown
                }
            }
        }))
        resolve(result);
    })
}

function downloadAndReadFile(url: string) {
    return new Promise<string>(async (resolve, reject) => {
        const storage = getStorage();
        try {
            const reference = ref(storage, url);
            const downloadUrl = await getDownloadURL(reference)
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
                var reader = new FileReader();
                //handler executed once reading(blob content referenced to a variable) from blob is finished. 
                reader.onload = function() {
                    resolve(reader.result as string);
                }
                //start the reading process.
                reader.readAsText(blob);
            };
            xhr.open('GET', downloadUrl);
            xhr.send();
        } catch(e) {
            reject(e)
        }
    })
    
}
