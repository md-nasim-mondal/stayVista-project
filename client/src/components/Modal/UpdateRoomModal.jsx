import PropTypes from "prop-types";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import UpdateRoomForm from "../Form/UpdateRoomForm";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { imageUpload } from "../../api/utils";

const UpdateRoomModal = ({ setIsEditModalOpen, isOpen, room, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [roomData, setRoomData] = useState(room);
  const [loading, setLoading] = useState(false);

  const [dates, setDates] = useState({
    startDate: new Date(room?.from),
    endDate: new Date(room?.to),
    key: "selection",
  });

  // handle Image update
  const handleImage = async (image) => {
    setLoading(true);
    try {
      // upload Image
      const image_url = await imageUpload(image);
      setRoomData({ ...roomData, image: image_url });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };
  // Date Range handler
  const handleDates = (range) => {
    // console.log(range);
    setDates(range.selection);
    setRoomData({
      ...roomData,
      to: range.selection.endDate,
      from: range.selection.startDate,
    })
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const updatedRoomData = Object.assign({}, roomData);
    delete updatedRoomData._id;
    try {
      await axiosSecure.put(`/room/update/${room?._id}`, updatedRoomData);
      refetch();
      setIsEditModalOpen(false);
      setLoading(false);
      toast.success("Home info updated successfully!!");
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsEditModalOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'>
                  Update Room Info
                </DialogTitle>
                <div className='mt-2 w-full'>
                  {/* Update room form */}
                  <UpdateRoomForm
                    handleSubmit={handleSubmit}
                    dates={dates}
                    handleDates={handleDates}
                    roomData={roomData}
                    loading={loading}
                    handleImage={handleImage}
                    setRoomData={setRoomData}
                  />
                </div>
                <hr className='mt-8 ' />
                <div className='mt-2 '>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

UpdateRoomModal.propTypes = {
  setIsEditModalOpen: PropTypes.func,
  isOpen: PropTypes.bool,
  room: PropTypes.object,
  refetch: PropTypes.func,
};

export default UpdateRoomModal;
