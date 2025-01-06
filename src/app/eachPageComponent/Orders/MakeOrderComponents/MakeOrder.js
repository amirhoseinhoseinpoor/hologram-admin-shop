"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import style from "../../../Styles/MakeOrderStyle/MakeOrder.module.scss";
import ProcessTracker from "../ProcessTracker";
import PusherChat from "./Talkjs";
import styled from "styled-components";
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
    /* background-color: rgb(26, 32, 53) !important; */
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

export default function MakeOrder({
  seeOrder,
  setActiveKey,
  toggleShow,
  setUpdateData,
}) {
  const [step, setStep] = useState(1);
  const [shouldSetStep, setShouldSetStep] = useState(true);

  console.log(seeOrder);
  

  useEffect(() => {
    if (seeOrder && shouldSetStep) {
      setStep(seeOrder.step);
      setShouldSetStep(true);
    }
  }, [seeOrder]);

  const [disabelInput, setDisabelInput] = useState(false);
  const [disabelInputStep2, setDisabelInputStep2] = useState(false);
  const [disabelInputStep4, setDisabelInputStep4] = useState(false);

  const handleNextStep = () => {
    setShouldSetStep(false);
    setUpdateData(true)
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setShouldSetStep(false);
    setUpdateData(true)
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };


  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={style.stepContent}>
            <SteponeComponent
              reqComment={seeOrder.reqComment}
              payment={seeOrder.payment}
              step={seeOrder.step}
              data={seeOrder.request}
              code={seeOrder.code}
              setStep={setStep}
              handleNextStep={handleNextStep}
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
            setStep={setStep}
            handleNextStep={handleNextStep}
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
          <div className={style.stepContent}>
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
        );
      case 5:
        return (
          <StepSixComponent
            finalFactor={seeOrder.payment}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        );
      case 6:
        return <StepSeven handleNextStep={handleNextStep} />;
      default:
        return null;
    }
  };
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

      <ProcessTracker currentStep={step} />
      {renderStepContent()}
    </section>
  );
}
