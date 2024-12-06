const Modal = ({ show, onClose, orderDetail }: any) => {
    if (!show || !orderDetail) return null; // Asegurarse de que se muestre solo cuando la orden esté seleccionada

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 shadow-xl rounded-3xl p-8 w-[50vw] h-[70vh] overflow-y-auto max-w-3xl">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                    >
                        <span className="text-lg font-bold">×</span>
                    </button>
                </div>

                <h1 className="text-4xl font-extrabold text-center text-[#263238] mt-6">Detalles de la compra</h1>

                <div className="mt-6 space-y-6">
                    <div className="border-t-2 border-gray-300 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-700 font-semibold">Nº de recibo</p>
                                <h6 className="text-gray-900 font-medium text-lg">{orderDetail.id}</h6>
                            </div>
                            <div>
                                <p className="text-gray-700 font-semibold">Fecha de trabajo</p>
                                <p className="text-gray-900">{new Date(orderDetail.startTime).toLocaleString("es-ES")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t-2 border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <p className="text-gray-700 font-semibold mb-2">Precio total Pagado</p>
                        <h6 className="text-xl text-gray-900 font-bold">${orderDetail.totalPrice}</h6>
                    </div>
                </div>

                <div className="mt-8 bg-gradient-to-br from-green-50 to-teal-100 text-white p-6 rounded-lg shadow-lg">
                    <label htmlFor="token" className="block text-sm font-medium mb-2 text-center text-gray-800">Token de confirmación</label>
                    <input
                        type="text"
                        id="token"
                        value={orderDetail.userToken}
                        readOnly
                        className="w-full bg-gray-700 text-center text-gray-200 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <p className="text-xs text-gray-600 mt-2 text-center">Proporciona este token para confirmar el servicio terminado</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
