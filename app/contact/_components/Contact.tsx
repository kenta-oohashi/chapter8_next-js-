"use client";

import { useState } from "react";
import style from "./contact.module.css";
export default function Contact() {
  //useStateの記述
  type Form = {
    name: string;
    email: string;
    message: string;
  }

  const [form, setForm] = useState<Form>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Form>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //formに入力された内容をstateに反映させる
  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  //バリデーション内容のと関数を記述→別ページに記載しimport?
  const validate = ():boolean => {
    const errors: { 
        name: string;
        email: string;
        message: string;
    } = {
      name: "",
      email: "",
      message: "",
    };

    if (!form.name.trim()) {
      errors.name = "お名前は必須です。";
    } else if (form.name.length > 30) {
      errors.name = "お名前は30文字以内で入力にしてください。";
    }

    if (!form.email.trim()) {
      errors.email = "メールアドレスは必須です。";
    } else if (!/.+@.+\..+/.test(form.email)) {
      errors.email = "メールアドレスの形式が正しくありません。";
    }

    if (!form.message.trim()) {
      errors.message = "本文は必須です。";
    } else if (form.message.length > 500) {
      errors.message = "本文は500文字以内で入力してください";
    }

    setErrors(errors);

    return !errors.name && !errors.email && !errors.message;
  };

  //クリアボタンを押したら中身削除（stateを初期化し空にする）
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      message: "",
    });
    //エラーメッセージを空にする→多分クリアボタンを押したらstateを空にするのとセット
    setErrors({
      name: "",
      email: "",
      message: "",
    });
  };

  //送信を押した後に処理される内容を書く
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //送信停止

    if (!validate()) return; //バリデーションチェック。validateがfalse(バリデーションに引っかかったら、ここで止める）つまり、送信させない

    try {
      //tryは成功時の処理
      setIsSubmitting(true);

      await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      alert("送信しました");
      resetForm();
    } catch (e) {
      alert("送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style["contact-container"]}>
      <div>
        <h2 className={style["contact-title"]}>お問い合わせフォーム</h2>
      </div>
      <form onSubmit={handleSubmit} className={style["contact-form"]}>
        <div className={style["contact-name"]}>
          <label htmlFor="name" className={style.label}>お名前</label>
          <div className={style["input-area"]}>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleForm}
              disabled={isSubmitting}
            />
            <p>{errors.name}</p>
          </div>
        </div>
        <div className={style["contact-email"]}>
          <label htmlFor="email" className={style.label}>メールアドレス</label>
          <div className={style["input-area"]}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleForm}
              disabled={isSubmitting}
            />
            <p>{errors.email}</p>
          </div>
        </div>
        <div className={style["contact-message"]}>
          <label htmlFor="message" className={style.label}>本文</label>
          <div className={style["input-area"]}>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleForm}
              disabled={isSubmitting}
            />
            <p>{errors.message}</p>
          </div>
        </div>
        <div className={style["contact-button"]}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={style["send-button"]}
          >
            送信
          </button>
          <button type="button" onClick={resetForm} disabled={isSubmitting}>
            クリア
          </button>
        </div>
      </form>
    </div>
  );
}
