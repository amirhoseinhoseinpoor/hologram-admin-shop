"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import style from "../../../Styles/MakeOrderStyle/MakeOrder.module.scss";
import ProcessTracker from "../ProcessTracker";
import styled from "styled-components";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
// import base component
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  margin: 7px 15px;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    .textHeaderStyle {
      /* color: white !important; */
    }
  }
`;

const SteponeComponent = dynamic(() => import("./StepOneComponent"));

// const StepBetweenOneAndTwo = dynamic(() => import("./StepBetweenOneAndTwo"))

const StepTwoComponent = dynamic(() => import("./StepTwoComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const StepFiveComponent = dynamic(() => import("./StepFiveComponent.js"));
const StepSixComponent = dynamic(() => import("./StepSixComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const StepSeven = dynamic(() => import("./StepSevenComponent"));
const PusherChat = dynamic(() => import("./Talkjs"), {
  ssr: false,
});

export default function MakeOrder({
  seeOrder,
  setActiveKey,
  toggleShow,
  setUpdateData,
}) {
  const [step, setStep] = useState(1);
  const [navStep, setNavStep] = useState(step || "");
  const [disabelInput, setDisabelInput] = useState(false);
  const [disabelInputStep2, setDisabelInputStep2] = useState(false);
  const [disabelInputStep4, setDisabelInputStep4] = useState(false);
  const [shouldSetStep, setShouldSetStep] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Function to convert status number to text
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "درحال برسی";
      case 2:
        return "درحال تولید";
      case 3:
        return "درحال ارسال";
      case 4:
        return "تحویل داده شده";
      case 5:
        return "لغو شده";
      default:
        return "Unknown Status";
    }
  };

  useEffect(() => {
    if (seeOrder && shouldSetStep) {
      setStep(seeOrder.step);
      setNavStep(seeOrder.step);
      setShouldSetStep(true);
    }
  }, [seeOrder]);

  const handleNextStep = () => {
    setShouldSetStep(false);
    setUpdateData(true);
    setStep((prevStep) => prevStep + 1);
  };

  const handleSetStep = (step) => {
    setShouldSetStep(false);
    setUpdateData(true);
    setStep(step);
  };

  const handlePreviousStep = () => {
    setShouldSetStep(false);
    setUpdateData(true);
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={style.stepContent}>
            <SteponeComponent
              reqComment={seeOrder?.reqComment}
              payment={seeOrder.payment}
              step={seeOrder.step}
              data={seeOrder.request}
              code={seeOrder.code}
              setStep={setStep}
              handleNextStep={handleNextStep}
              setNavStep={setNavStep}
              setDisabelInput={setDisabelInput}
              disabelInput={disabelInput}
            />
          </div>
        );
      case 2:
        return (
          <StepTwoComponent
            step={seeOrder.step}
            code={seeOrder.code}
            dataDocument={seeOrder.document}
            setUpdateData={setUpdateData}
            setStep={setStep}
            handleNextStep={handleNextStep}
            setNavStep={setNavStep}
            handlePreviousStep={handlePreviousStep}
            setDisabelInputStep2={setDisabelInputStep2}
            disabelInputStep2={disabelInputStep2}
          />
        );
      case 3:
        return (
          <PusherChat
            data={seeOrder.request}
            chatData={seeOrder.chat}
            chatFinalImage={seeOrder.chatImage}
            code={seeOrder.code}
            step={seeOrder.step}
            setUpdateData={setUpdateData}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        );
      case 4:
        return (
          <StepSixComponent
            finalFactor={seeOrder.payment}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        );
      case 5:
        return (
          <div className="container">
            <div className={`${style.stepContent}`}>
              <StepFiveComponent
                data={seeOrder.delivery}
                code={seeOrder.code}
                step={seeOrder.step}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                setDisabelInputStep4={setDisabelInputStep4}
                disabelInputStep4={disabelInputStep4}
              />
            </div>
          </div>
        );
      case 6:
        return <StepSeven handleNextStep={handleNextStep} />;
      default:
        return null;
    }
  };

  // Define the chat step number
  const chatStep = 3;
  const finalStep = 6;

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div
          onClick={() => setActiveKey("seeTable")}
          style={{ cursor: "pointer" }}
          className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center"
        >
          بازگشت به سفارشات
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>

      <div className="container">
        <div
          className={`d-flex flex-row align-items-center justify-content-between mb-3 ${style.mianDiVNvaBarOrder}`}
        >
          <div className="d-flex flex-row gap-2 align-items-center">
            <p className="discription">شماره سفارش :</p>
            <p className="discription">{seeOrder?.code}</p>
          </div>
          <div>
            <p className="discription">{getStatusText(seeOrder?.status)}</p>
          </div>
        </div>
      </div>

      <ProcessTracker
        currentStep={step}
        setStep={handleSetStep}
        navStep={navStep}
      />
      {renderStepContent()}
      {step !== chatStep && step !== finalStep && seeOrder && (
        <>
          <div
            onClick={handleOpenChat}
            className={`${style.DivChatIconMainDiv}`}
            style={{ cursor: "pointer" }}
          >
            <Image
              className={style.chatIContStyle}
              src="/gif/icons8-chat.gif"
              alt="Chat Icon"
              width={50}
              height={50}
              priority
            />
          </div>
          <Modal
            open={chatOpen}
            onClose={handleCloseChat}
            aria-labelledby="chat-modal-title"
            aria-describedby="chat-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxHeight: "fit-content",
                borderRadius: "4px",
                bgcolor: "background.paper",
                boxShadow: 24,
                padding: "10px",
                overflow: "auto",
              }}
            >
              <PusherChat
                modalChat={true}
                handleCloseChat={handleCloseChat}
                data={seeOrder.request}
                chatData={seeOrder.chat}
                code={seeOrder.code}
                step={seeOrder.step}
                setNavStep={setNavStep}
                setUpdateData={setUpdateData}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
              />
            </Box>
          </Modal>
        </>
      )}
    </section>
  );
}
