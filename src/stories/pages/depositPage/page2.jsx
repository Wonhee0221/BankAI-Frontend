import { VideoStateContext } from "App";
import { PwdWindowOptions } from "constants/password";
import { accFormatter } from "globalFunc/formatter";
import {
  useGetAllAccount,
  usePostCreateAccount,
} from "hooks/queries/accountQueries";
import { useContext, useEffect, useState } from "react";
import AccSelectBox from "stories/atoms/accSelectBox";
import LongButton from "stories/atoms/longButton";
import Title from "stories/atoms/title";
import HeaderBar from "stories/molecules/headerBar";

const Page2 = ({
  depositForm,
  setDepositForm,
  result,
  setSrc,
  setOptions,
  setType,
  setResult,
}) => {
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const [step, setStep] = useState(0);
  const handleStep = () => {
    setStep(step + 1);
  };
  const {setRepeat} = useContext(VideoStateContext)

  const { data: allAccount } = useGetAllAccount();
  const { mutate: createAccount, ok, msg } = usePostCreateAccount();

  let checkingAccCodes = [];
  if (allAccount) {
    checkingAccCodes = allAccount
      .filter((item) => item.prodType === "CHECKING")
      .map((item) => item.accCode);
  }

  useEffect(() => {
    setType("number");
    setSrc("assets/inputOutAcc.mov");
    setRepeat(false)
    console.log(depositForm);
  }, []);

  useEffect(() => {
    if (result) {
      if (step === 0) {
        checkingAccCodes.forEach((value) => {
          if (value === accFormatter(String(result.result))) {
            setSelectedAcc(value);
          }
          setResult(null);
          handleStep();
        });
      }
      else if (step === 1) {
        if (result === "맞아") {
          handleButtonClick();
        } else {
          setStep(0);
          setSrc("assets/inputOutAcc.mov");
          setType("number");
          setResult(null);
        }
      }
    }
  }, [result, step]);

  useEffect(() => {
    if (step === 1) {
      setOptions([{ name: "맞아" }, { name: "다시 입력할래" }]);
      setType("text");
      setSrc("/assets/checkAccNum.mov");
    }
  }, [step]);

  // useEffect(() => {
  //   checkingAccCodes.forEach((value) => {
  //     if (value === accFormatter(String(result.result))) {
  //       setSelectedAcc(value);
  //       return;
  //     }
  //   });
  // }, [result]);

  const handleSend = () => {
    console.log();
    createAccount(depositForm);
    setTimeout(()=>{
      window.location.href = "/main";
    },1000)
  };

  useEffect(() => {
    setDepositForm((draft) => {
      draft.outAccount = selectedAcc;
    });
  }, [selectedAcc, setDepositForm]);

  const onPopup = () => {
    window.open("/password?type=double", "_blank", PwdWindowOptions);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.pwd) {
        setDepositForm((draft) => {
          console.log(event.data.pwd);
          draft.accountPwd = event.data.pwd;
        });
      }
      if (event.data.isMatched && event.data.pwd) {
        setAllDone(true);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setDepositForm]);

  useEffect(()=>{
    if(depositForm.accountPwd){
      handleSend()
    }
  },[depositForm])

  const handleButtonClick = () => {
    if (!allDone) {
      onPopup();
    } else {
      handleSend();
    }
  };

  return (
    <div>
      <HeaderBar text={"예금가입"} />
      <Title text1={"어느계좌에서 출금할까요?"} />
      <div className="mt-25">
        {checkingAccCodes && (
          <AccSelectBox
            options={checkingAccCodes}
            selectedAcc={selectedAcc}
            setSelectedAcc={setSelectedAcc}
          />
        )}
        {!ok && msg && <div className="text-13 text-err-color p-5">{msg}</div>}
      </div>
      <div className="flex flex-col justify-center items-center mt-10 absolute left-0 bottom-0 w-full px-40 mb-50">
        <LongButton
          text={"다음"}
          active={!msg && (ok || !!selectedAcc)}
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
};

export default Page2;
