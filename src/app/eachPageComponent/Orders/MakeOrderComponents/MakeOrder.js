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

export default function MakeOrder({ seeOrder, setActiveKey, toggleShow }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(seeOrder.step);
  }, [seeOrder]);

  const [disabelInput, setDisabelInput] = useState(false);
  const [disabelInputStep2, setDisabelInputStep2] = useState(false);
  const [disabelInputStep4, setDisabelInputStep4] = useState(false);

  // Function to go to the next step
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Function to go to the previous step
  const handlePreviousStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  // Function to render the content based on the current step
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
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        );
      case 4:
        return (
          <div className={style.stepContent}>
            <StepFiveComponent
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
      {/* <div
        className={`${style.makeorderHeader} mb-4 d-flex justify-content-end`}
      >
        <p
          onClick={() => setActiveKey("seeTable")}
          className={`discription ${style.seeOrderButtonStyle}`}
        >
          بازگشت به سفارشات
        </p>
      </div> */}
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div
          onClick={() => setActiveKey("seeTable")}
          style={{cursor : "pointer"}}
          className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center"
        >
          بازگشت به سفارشات
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>
      {/* <div className="d-flex justify-content-end mb-4 mt-2 ms-3">
        <p
          onClick={() => setActiveKey("seeTable")}
          className={`discription ${style.seeOrderButtonStyle}`}
        >
          بازگشت به سفارشات
        </p>
      </div> */}

      <ProcessTracker currentStep={step} />
      {renderStepContent()}
    </section>
  );
}
