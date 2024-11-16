"use client";

import { useState, useEffect, useRef } from "react";
import style from "/src/app/Styles/MakeOrderStyle/Talkjs.module.scss";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import socket from "@/app/utils/socket";
// imporet modals
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
// import redux
import { useDispatch } from "react-redux";
import {
  sendNewMessage,
  uploadFile,
  fetchPrivateImage,
} from "@/app/Store/thunks";

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1.5px solid #000",
  boxShadow: 24,
  p: 0,
};

const ChatBox = ({
  handlePreviousStep,
  handleNextStep,
  chatData,
  code,
  step,
  data,
}) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const chatBoxRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCache, setImageCache] = useState({});
  const [messageToDeleteIndex, setMessageToDeleteIndex] = useState(null);
  const [moveForward, setMoveForward] = useState(false);
  const [FinalPaternModal, setFinalPaternModal] = useState(false);
  const [SendingFinalPattern, setSendingFinalPattern] = useState([]);

  const dontHavePattern = Object.keys(SendingFinalPattern).length == 0;

  console.log(SendingFinalPattern);

  const handleSendingPattern = () => {
    setFinalPaternModal(true);
  };

  const closeFinalPaternModal = () => setFinalPaternModal(false);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);

  // modal part state and function
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const areYouShureFunction = (index) => {
    setMessageToDeleteIndex(index);
    setOpenModal(true);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/png", "image/jpeg"];

    const newFiles = files
      .filter((file) => validImageTypes.includes(file.type)) // Only accept PNG and JPG
      .map((file) => ({
        imageUrl: URL.createObjectURL(file),
        file: file,
      }));

    setSendingFinalPattern((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Initialize socket connection
  useEffect(() => {
    setMessages(Array.isArray(chatData) ? chatData : []);

    // Listen for chat updates
    socket.on("chatUpdate", (data) => {
      if (data.code === code) {
        setMessages(Array.isArray(data.chat) ? data.chat : []);
      }
    });

    // Clean up the listener on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [code, chatData]);

  const handleEditMessage = (index) => {
    setEditIndex(index);
    setIsEditing(true);
    setMessage(messages[index].text || "");
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setIsEditing(false);
    setMessage("");
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    updateMessagesOnServer(updatedMessages);
    setOpenModal(false);
    setMessageToDeleteIndex(null);
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return; // Prevent sending empty messages

    if (isEditing) {
      // Editing an existing message
      const updatedMessages = messages.map((msg, i) =>
        i === editIndex ? { ...msg, text: message.trim() } : msg
      );
      setMessages(updatedMessages);
      setEditIndex(null);
      setIsEditing(false);
      setMessage("");
      updateMessagesOnServer(updatedMessages);
    } else {
      // Sending a new message
      const newMessageObject = {
        isAdmin: true,
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (message.trim()) {
        newMessageObject.text = message.trim();
      }

      if (image) {
        try {
          const tag = "chatBoxImage";
          const type = 1; // Adjust based on your backend logic
          const isPublic = false;

          const response = await dispatch(
            uploadFile({ file: image, tag, type, isPublic })
          ).unwrap();

          newMessageObject.imageUrl = response;
        } catch (error) {
          console.error("Image upload failed:", error);
          return;
        }
      }

      const updatedMessages = [...messages, newMessageObject];
      setMessages(updatedMessages);

      updateMessagesOnServer(updatedMessages);

      setMessage("");
      setImage(null);
      setSelectedImage(null);
    }
  };

  // Function to update messages on the server
  const updateMessagesOnServer = async (updatedMessages) => {
    try {
      // Assuming sendNewMessage action can be used to update the chat
      await dispatch(sendNewMessage({ code, newMessageSend: updatedMessages }));
    } catch (error) {
      console.error("Failed to update messages:", error);
      // Optionally handle the error (e.g., revert state, show notification)
    }
  };

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    console.log(image);
  };

  const handleCancelSending = () => {
    setImage(null);
    setSelectedImage(null);
  };

  useEffect(() => {
    const imageUrls = messages
      .filter((msg) => msg.imageUrl)
      .map((msg) => msg.imageUrl);

    imageUrls.forEach((url) => {
      if (!imageCache[url]) {
        dispatch(fetchPrivateImage({ filename: url }))
          .unwrap()
          .then((imageData) => {
            setImageCache((prevCache) => ({
              ...prevCache,
              [url]: imageData,
            }));
          })
          .catch((error) => {
            console.error("Failed to fetch image:", error);
          });
      }
    });
  }, [messages, dispatch, imageCache]);

  useEffect(() => {
    if (step > 3) {
      setMoveForward(true);
    }
  }, [step]);

  return (
    <>
      <div className={`${style.stepContent} container`}>
        <div className={style.mainChatBox}>
          <div
            className={`${style.headerChatBox} d-flex flex-row justify-content-between`}
          >
            <div>
              <p className="discription">
                {data?.prodName ? data.prodName : "محصول پایه"}
              </p>
            </div>
            <div className="discription">{code}</div>
          </div>

          {/* Scrollable chat area */}
          <div className={`${style.chatContainer} container`} ref={chatBoxRef}>
            {messages.length == 0 && (
              <p
                style={{ marginTop: "60px", marginBottom: "60px" }}
                className="discription text-center"
              >
                در حال حاضر پیامی وجود ندارد پیام خود را ارسال کنید
              </p>
            )}
            {Array.isArray(messages) &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.isAdmin ? style.adminMessage : style.userMessage
                  }`}
                >
                  {msg.text && (
                    <div className={style.allTextStyle}>
                      <p className="discription">{msg.text}</p>
                      <div
                        className={`${
                          msg.isAdmin
                            ? style.adminDateStyle
                            : style.userDateStyle
                        } d-flex flex-row `}
                      >
                        <p className={`${style.TimeStyle} smallest`}>
                          {msg.date}
                        </p>
                        {msg.isAdmin == true && (
                          <div className="d-flex flex-row">
                            <svg
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEditMessage(index)}
                              width={18}
                              height={17}
                              viewBox="0 0 25 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7599 3.59924L5.54985 12.2892C5.23985 12.6192 4.93985 13.2692 4.87985 13.7192L4.50985 16.9592C4.37985 18.1292 5.21985 18.9292 6.37985 18.7292L9.59985 18.1792C10.0499 18.0992 10.6799 17.7692 10.9899 17.4292L19.1999 8.73924C20.6199 7.23924 21.2599 5.52924 19.0499 3.43924C16.8499 1.36924 15.1799 2.09924 13.7599 3.59924Z"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit={10}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.3901 5.05078C12.8201 7.81078 15.0601 9.92078 17.8401 10.2008"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit={10}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3.5 22H21.5"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit={10}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <svg
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDeleteMessage(index)}
                              width={18}
                              height={17}
                              viewBox="0 0 25 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21.5 5.98047C18.17 5.65047 14.82 5.48047 11.48 5.48047C9.5 5.48047 7.52 5.58047 5.54 5.78047L3.5 5.98047"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 4.97L9.22 3.66C9.38 2.71 9.5 2 11.19 2H13.81C15.5 2 15.63 2.75 15.78 3.67L16 4.97"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M19.3499 9.14062L18.6999 19.2106C18.5899 20.7806 18.4999 22.0006 15.7099 22.0006H9.2899C6.4999 22.0006 6.4099 20.7806 6.2999 19.2106L5.6499 9.14062"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.8301 16.5H14.1601"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 12.5H15"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {msg.imageUrl && (
                    <>
                      {imageCache[msg.imageUrl] ? (
                        <>
                          {/* modal */}

                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box
                              component="img"
                              src={imageCache[msg.imageUrl]}
                              alt="uploaded"
                              className={style.modalStyleclass}
                              sx={ModalStyle}
                            ></Box>
                          </Modal>

                          <div className={style.allTextStyle}>
                            <Box
                              onClick={handleOpen}
                              className={`${style.imageChatStyle}`}
                              component="img"
                              src={imageCache[msg.imageUrl]}
                              alt="uploaded"
                            />
                            <div
                              className={`${
                                msg.isAdmin
                                  ? style.adminDateStyle
                                  : style.userDateStyle
                              } d-flex flex-row `}
                            >
                              <p className={`${style.TimeStyle} smallest`}>
                                {msg.date}
                              </p>
                              {msg.isAdmin == true && (
                                <div className="d-flex flex-row">
                                  <svg
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDeleteMessage(index)}
                                    width={18}
                                    height={17}
                                    viewBox="0 0 25 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M21.5 5.98047C18.17 5.65047 14.82 5.48047 11.48 5.48047C9.5 5.48047 7.52 5.58047 5.54 5.78047L3.5 5.98047"
                                      stroke="#292D32"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M9 4.97L9.22 3.66C9.38 2.71 9.5 2 11.19 2H13.81C15.5 2 15.63 2.75 15.78 3.67L16 4.97"
                                      stroke="#292D32"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M19.3499 9.14062L18.6999 19.2106C18.5899 20.7806 18.4999 22.0006 15.7099 22.0006H9.2899C6.4999 22.0006 6.4099 20.7806 6.2999 19.2106L5.6499 9.14062"
                                      stroke="#292D32"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10.8301 16.5H14.1601"
                                      stroke="#292D32"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 12.5H15"
                                      stroke="#292D32"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="mt-1 mb-1">Loading image...</p>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="position-relative mt-3">
          {selectedImage ? (
            <>
              <div
                className={`${style.mainDivSelectedImage} d-flex flex-row align-items-center justify-content-between`}
              >
                <Box
                  component="img"
                  src={selectedImage}
                  alt="uploaded"
                  className={style.selectedImageForSend}
                ></Box>
                <div className="d-flex flex-column gap-2 ms-3">
                  <button
                    onClick={sendMessage}
                    className={`${style.sendMessageChatBox} smallest`}
                  >
                    ارسال
                  </button>
                  <button
                    onClick={handleCancelSending}
                    className={`${style.cancelSendingImage} smallest`}
                  >
                    لغو
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <textarea
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام خود را بنویسید"
                className={`${style.inputChatBoxStyle} discription`}
              />
              {message.length == 0 && (
                <>
                  <label
                    htmlFor="fileInputChatBox"
                    className={style.LabelFileUpload}
                  >
                    <svg
                      width={27}
                      height={27}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5 7.5H15.7924C18.3773 7.5 20.5 9.52091 20.5 12C20.5 14.4709 18.3859 16.5 15.7924 16.5H14.5"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 16.5H8.21429C5.61714 16.5 3.5 14.4791 3.5 12C3.5 9.52909 5.61714 7.5 8.21429 7.5H9.5"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12H15.5"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                  <input
                    type="file"
                    onChange={handleSelectImage}
                    accept="image/*"
                    className={`d-none`}
                    id="fileInputChatBox"
                  />
                </>
              )}

              {message.length > 0 && (
                <button
                  onClick={sendMessage}
                  className={`${style.sendMessageChatBox2} smallest`}
                >
                  ارسال
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="d-flex flex-row gap-2 mt-3 mb-4 container">
        {/* <button onClick={handleNextStep} className={style.continueButton}>
          Continue
        </button> */}
        <button onClick={handleSendingPattern} className={style.continueButton}>
          ارسال طرح های نهایی
        </button>
        <button
          className={style.SeeLastStepButton}
          onClick={handlePreviousStep}
        >
          مرحله‌ی قبلی
        </button>
      </div>
      {/* modals */}
      {FinalPaternModal && (
        <Modal
          open={FinalPaternModal}
          onClose={closeFinalPaternModal}
          aria-labelledby="modal-modal-title2"
          aria-describedby="modal-modal-description2"
        >
          <>
            <div className={style.ModalPatternStyle}>
              {SendingFinalPattern?.map((fileObj, index) => (
                <>
                  <div className="d-flex flex-row">
                    <Box
                      // onClick={handleOpen}
                      className={`${style.imageChatStyle}  mb-2 mt-2`}
                      component="img"
                      src={fileObj.imageUrl}
                      style={{ width: "50%", height: "50%" }}
                      alt={`uploaded ${index}`}
                    />
                  </div>
                </>
              ))}
              {dontHavePattern && (
                <p className="discription text-center mt-4 mb-4">
                  هنوز طرحی اضافه نکرده اید
                </p>
              )}

            
                <div className="d-flex flex-row justify-content-between mt-3 mb-3">
                  <div className="me-2">
                    <label
                      htmlFor="fileFinalPattern"
                      className={style.LabelFileUploadPattern}
                    >
                      <p
                        className={`${style.addAnotherPattern} oneBeforeSmallest`}
                      >
                        اضافه کردن طرح
                      </p>
                    </label>
                    <input
                      onChange={handleFileUpload}
                      type="file"
                      // accept="image/*"
                      className={`d-none`}
                      id="fileFinalPattern"
                    />
                  </div>
                  {!dontHavePattern && (
                    <div className="ms-2">
                      <button className={style.confirmpatternButtonStyle}>
                        تایید نهایی
                      </button>
                    </div>
                  )}
                </div>
              
            </div>
          </>
        </Modal>
      )}
    </>
  );
};

export default ChatBox;
