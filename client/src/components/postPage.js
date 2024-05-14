import React, { useEffect, useState } from "react";
import { deletePostAction } from "../redux/actions";
import { useDispatch } from "react-redux";
import { user_id_from_token } from "../services/userService";
import CommentPage from "./commentPage";
import { useNavigate } from "react-router-dom";

const PostPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState("");
  useEffect(() => {
    async function fetchData() {
      let token = localStorage.getItem("jwt_token");
      const response = await user_id_from_token(token);
      const id = await response.data.user_id;
      setLoggedInUserId(id);
    }
    fetchData();
  }, []);

  // delete post
  const DeletePost = (postid, user_id) => {
    let username = localStorage.getItem("user_name");
    if (username === null) {
      alert("Unauthenticated user, Login first");
    } else {
      if (user_id === loggedInUserId) {
        if (window.confirm("Do you want to delete this?")) {
          dispatch(deletePostAction(postid));
        }
      } else {
        alert("Unauthorize user, You can not delete other`s post");
      }
    }
  };

  //edit post
  const EditPost = (postid, user_id, user_name) => {
    let username = localStorage.getItem("user_name");
    if (username === null) {
      alert("Unauthenticated user, Login first");
    } else {
      if (user_id === loggedInUserId) {
        if (window.confirm("Do you want to edit this?")) {
          navigate("/edit-post", {
            state: {
              post_uuid: postid,
              user_id: user_id,
              post_text: props.post_text,
              user_name: user_name,
            },
          });
        }
      } else {
        alert("Unauthorize user, You can not edit other`s post");
      }
    }
  };

  return (
    <>
      <div
        key={props.index}
        className="form-group bg-dark card row rounded mb-2"
      >
        <div className="mb-3 mt-3">
          <div>
            <h6 className="text-light" style={{ float: "left" }}>
              Showing Post
            </h6>
          </div>
          <div
            className="col-12 col-sm-6 col-md-12 p-2 bg-light card post"
            data-id="{val.post}"
          >
            <div className="d-flex justify-content-between">
              <div>
                <b>User Name: {props.user_name}</b>
              </div>
              {loggedInUserId ? (
                <div>
                  <button
                    type="submit"
                    style={{ marginRight: 5 + "px" }}
                    className="btn btn-primary"
                    onClick={() =>
                      EditPost(props.post_uuid, props.user_id, props.user_name)
                    }
                  >
                    ✏️
                  </button>
                  <button
                    type="submit"
                    className="btn btn-info"
                    onClick={() => DeletePost(props.post_uuid, props.user_id)}
                  >
                    ❌
                  </button>
                </div>
              ) : null}
            </div>
            <hr />
            {props.post_text}
          </div>
        </div>
        <div className="mt-3">
          <CommentPage
            index={props.index}
            postid={props.post_uuid}
            loggedInUserId={loggedInUserId}
            user_name={props.user_name}
          />
        </div>
      </div>
    </>
  );
};
export default PostPage;
