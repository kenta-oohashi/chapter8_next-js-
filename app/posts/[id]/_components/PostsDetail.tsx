"use client";

import { useParams } from "next/navigation";
import style from "./PostsDetail.module.css";
import { useEffect, useState } from "react";
import type { Post } from "../../../_types/Post";
import Image from "next/image";

export default function PostsDetail() {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        `https://n9u0id58lf.microcms.io/api/v1/posts/${id}?depth=1`,
        {
          headers: {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        }
      );
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };
    fetcher();
  }, [id]);

  if (loading) {
    return <p>データ取得中</p>;
  }

  if (!post) {
    return (
      <div role="alert">
        <h1>404 Not Found</h1>
        <p>記事は見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div>
      <div className={style["post-list-container"]}>
        <Image
          src={
            post.thumbnail
              ? post.thumbnail.url
              : "https://placehold.jp/300x160.png"
          }
          alt={post.thumbnail ? post.title : "ダミー画像"}
          width={300}
          height={160}
          className={style.thumbnail}
        />
        <div className={style["post-card-info"]}>
          <div className={style["create-data"]}>
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className={style["post-categories"]}>
            {post.categories.map((category) => (
              <span key={category.id} className={style["post-tag"]}>
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <h2 className={style["post-title"]}>{post.title}</h2>
        <div
          className={style["post-content"]}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </div>
  );
}
