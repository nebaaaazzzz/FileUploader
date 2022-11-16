import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.les
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Table } from "antd";
const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const fetchProjects = async ({ pageParam = 1 }) => {
    console.log(pageParam);
    const res = await fetch("http://localhost:8080/?page=" + pageParam);
    return res.json();
  };
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    isFetching,
    isPreviousData,
  } = useInfiniteQuery({
    queryKey: ["files"],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage, pages) => pages.length + 1,
  });
  console.log(data?.pages);
  const handleRemove = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const value = confirm("Are u sure u want to delete");
    if (value) {
      await fetch(
        "http://localhost:8080/" + e.currentTarget.getAttribute("data-id"),
        {
          method: "delete",
        }
      );
      queryClient.refetchQueries();
    }
  };
  const columns = [
    {
      title: "File Name",
      dataIndex: "originalFileName",
      key: "name",
    },
    {
      title: "File Size",
      dataIndex: "fileSize",
      key: "size",
      render: (size: string) => {
        return <p>{Number(size) / 1000000} MB</p>;
      },
    },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "date",
      render: (dateToFormat: string) => {
        return <p>{moment(dateToFormat).fromNow()}</p>;
      },
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id: string) => {
        return (
          <div>
            <button
              data-id={id}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
              onClick={handleRemove}
            >
              delete
            </button>
            <button
              data-id={id}
              className="bg-blue-500 mx-10 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
              <a href={"http://localhost:8080/" + id} download={true}>
                Download
              </a>
            </button>
          </div>
        );
      },
    },
    {},
  ];
  const notify = () =>
    toast("please select file!", {
      type: "error",
      closeOnClick: true,
      autoClose: 1000,
    });
  const fileRef = React.createRef<HTMLInputElement>();
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const file = new FormData();
    if (fileRef.current?.files) {
      if (fileRef.current.files.length) {
        if (fileRef.current.files[0].size < 10000000) {
          file.set("file", fileRef.current.files[0]);

          await fetch("http://localhost:8080/file", {
            method: "post",
            body: file,
          });
          toast("Successfuly uploaded", {
            type: "success",
            autoClose: 1000,
            closeOnClick: true,
          });
          queryClient.refetchQueries();
          const formEmt: HTMLFormElement = e.target as HTMLFormElement;
          formEmt.reset();
        } else {
          toast("File size too big", {
            type: "error",
            autoClose: 1000,
            closeOnClick: true,
          });
        }
      } else {
        notify();
      }
    } else {
      notify();
    }
  };
  return (
    <div className="w-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <header className="h-12 flex items-center bg-blue-600 max-w-full">
        <p className="text-stone-50 p-2">File Uploader</p>
      </header>
      <form
        className="flex  items-center justify-center gap-5 m-10"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="file"
            className="text-lg border-solid border-red-500 m-10"
          >
            SelectFile below 10MB
          </label>
          <input ref={fileRef} type="file" name="" id="file" />
        </div>
        <input
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          value="Upload File"
        />
      </form>
      {data ? (
        <div className="flex items-center flex-col ">
          <Table
            className="w-full"
            onChange={() => {
              console.log(data);
              setPage(page + 1);
            }}
            // loading
            pagination={false}
            loading={isLoading}
            bordered
            dataSource={data.pages.flat()}
            columns={columns}
          />
          <button
            onClick={() => {
              fetchNextPage();
            }}
            className="bg-blue-500 hover:bg-blue-700 m-10 text-white font-bold py-2 px-4 rounded "
          >
            load more
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
