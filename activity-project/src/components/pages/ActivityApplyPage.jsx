import classes from "./ActivityApplyPage.module.css";
import Input from "../UI/Input";
import { useState } from "react";
import SelectBox from "../UI/SelectBox";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PLACEOPTIONS } from "../../constants";
import { BASE_URL } from "../../config";

function ActivityApplyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: undefined,
    time: undefined,
    details: undefined,
    representative: undefined,
    participants: undefined,
    place: "0",
    instructor: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    async function fetchFn() {
      try {
        setIsLoading(true);
        const url = `${BASE_URL}/api/activities`;
        const res = await axios.post(url, { ...formData });
        console.log(res.data);
        alert("신청이 완료되었습니다!");
        setIsLoading(false);
        navigate("/activity");
      } catch (error) {
        console.log(error);
      }
    }

    fetchFn();
  }

  function handleInputChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: value,
      };
    });
  }

  return (
    <>
      <header className={classes.header}>내비게이션</header>
      <main className={classes.main}>
        <div className={classes.intro}>
          <h2>탐활서 신청</h2>
          <p>탐활서 신청 페이지입니다.</p>
        </div>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Input
            label="활동일자"
            name="date"
            type="date"
            onChange={handleInputChange}
            required
            full
          />
          <Input
            label="활동시간"
            name="time"
            onChange={handleInputChange}
            required
            full
          />
          <Input
            label="활동내용"
            name="details"
            onChange={handleInputChange}
            required
            full
          />
          <Input
            label="참여학생"
            name="participants"
            onChange={handleInputChange}
            textArea
            required
            full
          />
          <Input label="활동장소" required third>
            <SelectBox
              name="place"
              options={PLACEOPTIONS}
              onChange={handleInputChange}
            />
          </Input>
          <Input
            label="대표학생"
            name="representative"
            onChange={handleInputChange}
            third
          />
          <Input
            label="지도교사"
            name="instructor"
            onChange={handleInputChange}
            third
          />
          <div className={classes.buttonGroup}>
            <Link to="/activity">
              <button type="button" className={classes.cancleButton}>
                취소(돌아가기)
              </button>
            </Link>
            <button className={classes.submitButton}>신청하기</button>
          </div>
        </form>
      </main>
    </>
  );
}

export default ActivityApplyPage;
