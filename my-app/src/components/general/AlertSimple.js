import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

function AlertSimple({ icon, title, text }) {
  // Swal.fire({
  //     title: 'Error!',
  //     text: 'Do you want to continue',
  //     icon: 'error',
  //     confirmButtonText: 'Cool',
  // });

  Swal.fire({
    title: { title },
    text: { text },
    icon: { icon },
    confirmButtonText: 'Cool',
  });

  return null;
}

export default AlertSimple;
