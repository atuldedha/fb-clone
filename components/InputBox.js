import { useSession } from "next-auth/client"
import {EmojiHappyIcon} from '@heroicons/react/outline'
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import Image from 'next/image'
import { useRef, useState } from "react";
import firebase from 'firebase'
import {db, storage} from '../firebase'

const InputBox = () => {

    const [session, loading] = useSession();

    const inputRef = useRef();
    const filePickerRef = useRef();

    const [imageToPost, setImageToPost] = useState();

    const sendPost = (e) => {
        e.preventDefault();

        if(!inputRef.current.value) return;

        db.collection("posts").add({
            message: inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then((doc) => {
            if(imageToPost) {
                const uploadTask = storage.ref(`posts/${doc.id}`).putString(imageToPost, 'data_url')

                removeImage();

                uploadTask.on(
                    'state_change', 
                    null, 
                    error=>console.log(error),
                    () => {
                        storage.ref("posts").child(doc.id).getDownloadURL().then((url) => {
                            db.collection("posts").doc(doc.id).set({
                                postImage: url,
                            }, {merge: true})
                        })
                    }    
                )
            }
        })

        inputRef.current.value = "";
    }

    const addImageToPost = (e) => {
        
        const reader = new FileReader();

        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result)
        }

    }

    const removeImage = () => {
        setImageToPost(null)
    }

    return (
        <div className = "bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
            <div className = "flex space-x-4 p-4 items-center">

                <Image 
                    className = "rounded-full"
                    src = {session.user.image}
                    alt = {session.user.name}
                    height = {40}
                    width = {40}
                    layout = "fixed"
                />

                <form className = "flex flex-1">
                    <input
                        className = "rounded-full bg-gray-100 h-12 flex-grow px-5 outline-none"
                        type = "text" ref = {inputRef} 
                        placeholder = {`Whats on your mind ${session.user.name}?`} 
                    
                    />

                    <button hidden type = "submit" onClick = {sendPost} >Submit</button>
                </form>

                {imageToPost && (
                    <div onClick = {removeImage} className = "flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">

                        <img className = "h-10 object-contain" src = {imageToPost} />
                    </div>
                )}
            </div>

            <div className = "flex justify-evenly p-3 border-t">

                <div className = "inputIcon">
                    
                    <VideoCameraIcon className = "h-7 text-red-500" />
                    <p className = "text-xs sm:text-sm xl:text-base">Live Video</p>
                
                </div >

                <div onClick = {() => filePickerRef.current.click()} className = "inputIcon"> 

                    <CameraIcon className = "h-7 text-green-400" />
                    <p className = "text-xs sm:text-sm xl:text-base">Photo/Video</p>
                    <input ref = {filePickerRef} onChange = {addImageToPost} type = "file" hidden />
                
                </div>

                <div className = "inputIcon">

                    <EmojiHappyIcon className = "h-7 text-yellow-300" />
                    <p className = "text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
                
                </div>

            </div>

        </div>
    )
}

export default InputBox
