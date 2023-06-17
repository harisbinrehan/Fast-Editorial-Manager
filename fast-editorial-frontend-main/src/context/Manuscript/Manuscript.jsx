import axios from "axios";
import { createContext, useState, useContext } from "react";
import { UserContext } from "../../context/Users/User";
export const ManuscriptContext = createContext({
  imageFile: null,
  setImageFile: () => { },
  imageFileName: "",
  setImageFileName: () => { },
  pdfFile: null,
  setPdfFile: () => { },
  pdfFileName: null,
  setPdfFileName: () => { },
  bioFile: null,
  setBioFile: () => { },
  bioFileName: null,
  setBioFileName: () => { },
  fileType: null,
  setFileType: () => { },
});
export const ManuscriptProvider = (props) => {
  const { user } = useContext(UserContext);
  const [manuscriptId, setManuscriptId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [bioFile, setBioFile] = useState(null);
  const [bioFileName, setBioFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [title, setTitle] = useState("");
  const [correspondingAuthorName, setCorrespondingAuthorName] = useState("");
  const [correspondingAuthorEmail, setCorrespondingAuthorEmail] = useState("");
  const [correspondingAuthorPhoneNumber, setCorrespondingAuthorPhoneNumber] =
    useState("");
  const [abstract, setAbstract] = useState("");

  const [reviewers, setReviewers] = useState([]);
  const [comments, setComments] = useState([]);
  const [minorfields, setMinorFields] = useState([]);
  const [majorFields, setMajorFields] = useState("");


  const uploadFile = async (authorId) => {
    console.log("in upload file", value)
    try {
      //${process.env.BASE_URL}
      const formData = new FormData();

      formData.append('manuscript', value.pdfFile, value.pdfFileName);
      formData.append('authorPhoto', value.imageFile, value.imageFileName);
      formData.append('manuscriptTitle', value.pdfFileName);
      formData.append('authorFileName', value.imageFileName);
      formData.append('authorId', authorId);
      formData.append('manuscriptId', value.manuscriptId);
      if (value.bioFile && value.bioFileName) {
        formData.append('authorBiography', value.bioFile, value.bioFileName);
        formData.append('bioFileName', value.bioFileName);
      }
      let response = await axios.post(`http://localhost:8000/author/upload-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data;
    }
    catch (err) {
      console.error(err)
      alert("Error uploading file")

    }
  }
  const fillForm = async () => {
    try {
      const requestBody = {
        manuscriptId: manuscriptId, // Replace with the manuscriptId
        title: title,
        abstract: abstract,
        // Replace with the author data
        minorfields: minorfields,
        majorfield: majorFields,
        correspondingAuthorName: correspondingAuthorName,
        correspondingAuthorPhone: correspondingAuthorPhoneNumber,
        correspondingAuthorEmail: correspondingAuthorEmail,
      };

      const response = await axios.put(
        "http://localhost:8000/author/fill-form",
        requestBody
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error filling form");
    }
  };

  const additionalComments = async () => {
    try {
      const requestBody = {
        manuscriptId: manuscriptId,
        additionalComments: comments
      };
      console.log("Request payload:", requestBody);
      const response = await axios.put(
        "http://localhost:8000/author/additional-comments",
        requestBody
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error adding additional comments");
    }
  };
  const submitManuscript = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/author/manuscript-submit/${manuscriptId}`);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting manuscript");
    }
  };
  const updateData = async (step) => {
    try {
      switch (step) {
        case 0:
          const authorId = user.authorId;
          const uploadResponse = await uploadFile(authorId);
          setManuscriptId(uploadResponse.data.manuscriptId);
          if (uploadResponse.data.abstract) {
            setAbstract(uploadResponse.data.abstract);
          }
          break;
        case 1:
          await fillForm();
          break;
        // case 2:
        //   await addRecommendReviewers();
        //   break;
        case 3:
        // await additionalComments();
        // break;
        default:
          console.log(`Invalid step: ${step}`);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };
  //////////////For drafting (incomplete Submission)///////////////////
  const getFileNameFromPath = (filePath) => {
    return filePath.split('\\').pop().split('/').pop();
  };
  const fetchRecommendedReviewers = async (id) => {
    const response = await fetch(
      `http://localhost:8000/author/recommend-reviewers/${id}`
    );
    const reviewersData = await response.json();

    const refinedReviewers = reviewersData.recommendedReviewers.map((reviewer) => {
      return {
        firstName: reviewer.firstName,
        lastName: reviewer.lastName,
        degree: reviewer.degree,
        position: reviewer.position,
        organisation: reviewer.organisation,
        department: reviewer.department,
        email: reviewer.email,
        majorField: reviewer.majorField,
        minorFields: reviewer.minorFields,
      };
    });

    setReviewers(refinedReviewers);
  };
  const setManuscriptData = (manuscript) => {
    if (manuscript) {
      console.log("Manuscript data:", manuscript)
      setManuscriptId(manuscript._id);
      setTitle(manuscript.title);
      setAbstract(manuscript.abstract);
      setMinorFields(manuscript.minorfields);
      setMajorFields(manuscript.majorfield);
      setCorrespondingAuthorName(manuscript.correspondingAuthor);
      setCorrespondingAuthorPhoneNumber(manuscript.correspondingAuthorPhone);
      setCorrespondingAuthorEmail(manuscript.correspondingAuthorEmail);
      fetchRecommendedReviewers(manuscript._id);
      setComments(manuscript.additionalComments);
      setImageFileName(getFileNameFromPath(manuscript.authorPhoto));
      setPdfFileName(getFileNameFromPath(manuscript.manuscript));
    }
  };


  const value = {
    manuscriptId,
    setManuscriptId,
    imageFile,
    setImageFile,
    imageFileName,
    setImageFileName,
    pdfFile,
    pdfFileName,
    setPdfFile,
    setPdfFileName,
    bioFile,
    setBioFile,
    bioFileName,
    setBioFileName,
    fileType,
    setFileType,
    title,
    setTitle,
    correspondingAuthorName,
    setCorrespondingAuthorName,
    correspondingAuthorEmail,
    setCorrespondingAuthorEmail,
    correspondingAuthorPhoneNumber,
    setCorrespondingAuthorPhoneNumber,
    abstract,
    setAbstract,
    reviewers,
    setReviewers,
    comments,
    setComments,
    minorfields,
    setMinorFields,
    majorFields,
    setMajorFields,
    updateData,
    setManuscriptData,
    submitManuscript
  };

  return (
    <ManuscriptContext.Provider value={value}>
      {props.children}
    </ManuscriptContext.Provider>
  );
};
