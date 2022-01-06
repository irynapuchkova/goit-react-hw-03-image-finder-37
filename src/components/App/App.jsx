import { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchInfo } from "../../API/fetchimages";
import Searchbar from "../Searchbar/Searchbar";
import Button from "../Button/Button";
import ImageGallery from "../ImageGallery/ImageGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";

import { AppContainer } from "./App.styled";

export default class App extends Component {
  state = {
    images: [],
    inputValue: "",
    page: 1,
    totalHits: null,
    reqStatus: "idle",
    selectedImg: "",
  };

  async componentDidUpdate(_, prevState) {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

    const { inputValue, page } = this.state;

    if (inputValue.trim() === "") {
      return toast("PlEASE ENTER YOUR QUERY");
    }

    if (prevState.inputValue !== inputValue && inputValue.trim() !== "") {
      try {
        this.setState({ reqStatus: "pending" });
        const { hits, totalHits } = await fetchInfo(inputValue, 1);
        toast(`We found ${totalHits} images`);

        this.setState({
          images: hits,
          totalHits,
          reqStatus: "resolved",
          page: 1,
        });
      } catch (error) {
        this.setState({ reqStatus: "rejected" });
        console.error(error.message);
      }
    }

    if (
      prevState.inputValue === inputValue &&
      prevState.page !== page &&
      page !== 1
    ) {
      try {
        this.setState({ reqStatus: "pending" });
        const { hits } = await fetchInfo(inputValue, page);
        this.setState((prevState) => ({
          images: [...prevState.images, ...hits],
          reqStatus: "resolved",
        }));
      } catch (error) {
        this.setState({ reqStatus: "rejected" });
        console.error(error.message);
      }
    }
  }

  onLoadmoreButtonClick = (e) => {
    if (e.currentTarget === e.target) {
      this.setState((prevState) => ({ page: prevState.page + 1 }));
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({ selectedImg: !prevState.selectedImg }));
  };

  onSelectedImg = (selectedImage) => {
    this.setState({ selectedImg: selectedImage });
  };

  render() {
    const { images, totalHits, selectedImg, reqStatus } = this.state;
    const showBtnLoadMore = images.length >= 12 && images.length < totalHits;
    return (
      <AppContainer>
        <Searchbar onSubmit={(value) => this.setState({ inputValue: value })} />
        <ToastContainer role="alert" autoClose={2000} />
        {reqStatus === "pending" && <Loader />}
        <ImageGallery data={images} onSelect={this.onSelectedImg} />
        {showBtnLoadMore && <Button onClick={this.onLoadmoreButtonClick} />}
        {selectedImg && (
          <Modal onClose={this.toggleModal}>
            <img src={selectedImg} alt="" />
          </Modal>
        )}
      </AppContainer>
    );
  }
}
