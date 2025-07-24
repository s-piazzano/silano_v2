"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { ChevronLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import { useRemarkSync, Remark } from "react-remark";

export default function Assistant({ component }) {
  //counter
  let counter = useRef(0);
  let answer = useRef(new Array());

  const [phase, setPhase] = useState(-1);

  const redirect = (red, answerTemp) => {
    if (red > 0) {
      answer.current = [...answer.current, ...answerTemp];
      const index = component.assistan_option.data.attributes.steps.findIndex(
        (x) => x.id === red
      );

      setPhase(index);
    } else {
      setPhase(-100);
    }
  };

  const undo = () => {
    answer.current = [];
    setPhase(-1);
  };

  return (
    <div className="border border-forest rounded-sm p-4 relative">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <div className="flex flex-col items-center w-[80px]">
            <Image
              className="w-[60px] h-[60px]"
              src={component.avatar.data.attributes.url}
              alt={component.avatar.data.attributes.name}
              width={60}
              height={60}
            />
          </div>
          <div className="w-full">
            {/*   question session
            -phase -1 show description
            -phase >0 show steps question
            -phase -100 show result */}
            {phase == -1 && (
              <Remark >{component.description}</Remark>
            )}
            {phase >= 0 && (
              <Remark >
                {
                  component.assistan_option.data.attributes.steps[phase]
                    .question
                }
              </Remark>
            )}
            {phase === -100 && (
              <div className="flex justify-between">
                <Remark >
                  {component.assistan_option.data.attributes.result.message}
                </Remark>
                <button className="w-8 h-8 text-forest" onClick={() => undo()}>
                  <ArrowPathIcon></ArrowPathIcon>
                </button>
              </div>
            )}
          </div>
        </div>
        {phase === -1 && (
          <button
            className="bg-forest p-2 rounded-sm text-base-100"
            onClick={() => redirect(1, [])}
          >
            {component.button}
          </button>
        )}

        {phase >= 0 && (
          <div className=" flex flex-col space-y-2">
            {component.assistan_option.data.attributes.steps[
              phase
            ]?.options.map((option, index) => {
              return (
                <button
                  className="bg-forest p-2 rounded-sm text-base-100"
                  key={`option-${index}`}
                  onClick={() => redirect(option.redirect, option.answer)}
                >
                  {option.button}
                </button>
              );
            })}
          </div>
        )}
        {phase === -100 && (
          <div className="w-full flex flex-col justify-between pt-4">
            <ul className="flex flex-col pl-2 font-semibold">
              {answer.current.map((x, index) => (
                <li key={index}>{x}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
