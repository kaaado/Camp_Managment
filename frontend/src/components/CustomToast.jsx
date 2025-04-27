import React from 'react';
import { Toaster, ToastBar } from 'react-hot-toast';

const customToaster = () => {
  return (
    <Toaster
      position="bottom-center"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      }}
    >
      {(t) => (
        <ToastBar
          className="toast"
          toast={t}
          style={{
            ...t.style,
            animation: t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, paddingRight: '10px' }}>
            {t.message}
            </div>
        </ToastBar>
      )}
    </Toaster>
  );
};

export default customToaster;
