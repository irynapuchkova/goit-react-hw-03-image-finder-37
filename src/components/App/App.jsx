import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { fetchInfo } from '../../API/fetchImages';
import Searchbar from '../Searchbar/Searchbar';
import Button from '../Button/Button';
import ImageGallery from '../ImageGallery/ImageGallery';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';

import 'react-toastify/dist/ReactToastify.css';
import { AppContainer } from './App.styled';

export default class App extends Component {
  state = {
    images: [],
    inputValue: '',
    page: 1,
    totalHits: null,
    reqStatus: 'idle',
    selectedImg: '',
  };

  async componentDidUpdate(_, prevState) {
    const { inputValue, page } = this.state;

    if (!inputValue) {
      return toast('PlEASE ENTER YOUR QUERY');
    }

    if (prevState.inputValue !== inputValue && inputValue !== '') {
      try {
        this.setState({ reqStatus: 'pending' });
        const { hits, totalHits } = await fetchInfo(inputValue, 1);
        toast(`We found ${totalHits} images`);

        this.setState({
          images: hits,
          totalHits,
          reqStatus: 'resolved',
          page: 1,
        });
      } catch (error) {
        this.setState({ reqStatus: 'rejected' });
        console.error(error.message);
      }
    }

    if (
      prevState.inputValue === inputValue &&
      prevState.page !== page &&
      page !== 1
    ) {
      try {
        this.setState({ reqStatus: 'pending' });
        const { hits } = await fetchInfo(inputValue, page);
        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
          reqStatus: 'resolved',
        }));

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (error) {
        this.setState({ reqStatus: 'rejected' });
        console.error(error.message);
      }
    }
  }

  handleSearchbarInfo = inputValue => {
    this.setState({ inputValue });
  };

  onLoadMoreButtonClick = ({ target, currentTarget }) => {
    if (currentTarget === target) {
      this.setState(prevState => ({ page: prevState.page + 1 }));
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({ selectedImg: !prevState.selectedImg }));
  };

  onSelectedImg = selectedImg => {
    this.setState({ selectedImg });
  };

  render() {
    const { images, totalHits, selectedImg, reqStatus } = this.state;
    const showBtnLoadMore = images.length >= 12 && images.length < totalHits;

    return (
      <AppContainer>
        <Searchbar onSubmit={this.handleSearchbarInfo} />
        <ToastContainer role="alert" autoClose={2000} />
        {reqStatus === 'pending' && <Loader />}
        <ImageGallery data={images} onSelect={this.onSelectedImg} />
        {showBtnLoadMore && <Button onClick={this.onLoadMoreButtonClick} />}
        {selectedImg && (
          <Modal onClose={this.toggleModal}>
            <img src={selectedImg} alt="Selected Gallery Item" />
          </Modal>
        )}
      </AppContainer>
    );
  }
}
