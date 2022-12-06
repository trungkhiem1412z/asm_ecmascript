'use strict';
// Import function kết nối DB
import {
  ref,
  onValue,
  set,
  push,
  update,
  onChildRemoved,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js';
// Import BD
import database from './db.js';

// Thêm sản phẩm
let addProduct = document.querySelector('#addProduct');
const addproduct = () => {
  const name = document.querySelector('#nameProduct');
  const price = document.querySelector('#priceProduct');
  const images = document.querySelector('#imageProduct');
  const hang = document.querySelector('#hangProduct');
  const detail = document.querySelector('#detailProduct');

  let item = {
    name: name.value,
    price: Number(price.value),
    images: images.value,
    hang: hang.value,
    detail: detail.value,
  };

  const products = ref(database, 'products/');
  const newProduct = push(products);
  set(newProduct, item);
};
addProduct.onclick = addproduct;

// Lấy data
const show_list_product = document.querySelector('.product-adm');
const getDataCate = async () => {
  const products = ref(database, 'products/');
  onValue(
    products,
    (item) => {
      item.forEach((childitem) => {
        const childKey = childitem.key;
        const childData = childitem.val();
        const list = `
            <tr>
                <td class="col-2">${childData.name}</td>
                <td class="col-2"><img src="${childData.images}"/></td>
                <td class="col-2"></td>
                <td class="col-2">${childData.price}</td>
                <td class="col-2">${childData.hang}</td>
                <td class="col-2">
                 <button class="btn btn-success" data-toggle="modal" data-target="#updateproduct" onclick="getDetailProduct('${childKey}')">Sửa</button>
                 <button onclick="deleteProduct('${childKey}')" class="btn btn-danger">Xoá</button>
                </td>
            </tr>
        `;
        show_list_product.innerHTML += list;
      });
    },
    {
      onlyOnce: true,
    }
  );
};
getDataCate();

// Lấy thông tin chi tiết
window.getDetailProduct = (childKey) => {
  let btnsave = document.querySelector('.modal-footer-update');
  let nameProductU = document.querySelector('#nameProductU');
  let priceProductU = document.querySelector('#priceProductU');
  let imageProductU = document.querySelector('#imageProductU');
  let hangProductU = document.querySelector('#hangProductU');
  let detailProductU = document.querySelector('#detailProductU');

  const dataDetail = ref(database, `products/${childKey}`);
  onValue(dataDetail, (dataDetail) => {
    const data = dataDetail.val();
    nameProductU.value = data.name;
    priceProductU.value = data.price;
    imageProductU.value = data.images;
    hangProductU.value = data.hang;
    detailProductU.value = data.value;
    const btn = `
        <button type="button" class="btn btn-primary" onclick="updateProduct('${childKey}')" data-dismiss="modal">Lưu</button>
      `;
    btnsave.innerHTML = btn;
  });
};

// Lưu chi tiết
window.updateProduct = (childKey) => {
  let nameProductU = document.querySelector('#nameProductU');
  let priceProductU = document.querySelector('#priceProductU');
  let imageProductU = document.querySelector('#imageProductU');
  let hangProductU = document.querySelector('#hangProductU');
  let detailProductU = document.querySelector('#detailProductU');

  let data = {
    name: nameProductU.value,
    price: Number(priceProductU.value),
    images: imageProductU.value,
    hang: hangProductU.value,
    detail: detailProductU.value,
  };
  const updates = {};
  updates[`products/${childKey}`] = data;
  return update(ref(database), updates);
};

// Xoá
window.deleteProduct = (childKey) => {
  let data = {
    name: null,
    price: null,
    images: null,
    hang: null,
    detail: null,
  };
  const updates = {};
  updates[`products/${childKey}`] = data;
  return update(ref(database), updates);
};
