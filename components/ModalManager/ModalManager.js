import { useModal } from 'context/ModalContext';
import ModalChangePassword from '../ModalAdmin/ModalChangePassword';
import ModalDeleteUser from '../ModalAdmin/ModalDeleteUser';
import BasicModal from '../ModalAdmin/Modal';
import ModalError from '../ModalAdmin/ModalError';
import ShareModal from '../Modal/ShareModal/ShareModal';

export default function ModalManager() {
  const { modal, closeModal } = useModal();

  const renderModal = () => {
    switch (modal.type) {
      case 'changePassword':
        return (
          <ModalChangePassword
            open
            onClose={closeModal}
            onSubmit={modal.props.onSubmit}
          />
        );
      case 'deleteUser':
        return (
          <ModalDeleteUser
            open
            onClose={closeModal}
            onConfirm={modal.props.onConfirm}
          />
        );
      case 'createUser':
        return (
          <BasicModal
            open
            onClose={modal.props.onClose}
            control={modal.props.control}
            onSubmit={modal.props.onSubmit}
            roles={modal.props.roles}
          />
        );
      case 'error':
        return (
          <ModalError
            open
            onClose={closeModal}
            error={modal.props.error}
          />
        );
      case 'share':
        return (
          <ShareModal
            open
            onClose={closeModal}
            sessionId={modal.props.sessionId}
          />
        )
      default:
        return null;
    }
  };

  return renderModal();
}