'use strict';

/**
 * @ngdoc service
 * @name clientApp.messages
 * @description
 * # messages
 * Constant in the clientApp.
 */
angular.module('tunariApp')
  .constant('Messages', {
      message001: 'Felicidades!, Ha creado el cliente ',
      message002: 'Felicidades!, Ha creado el producto ',
      message003: 'Ha modificado satisfactoriamente el cliente ',
      message004: 'Ha modificado satisfactoriamente el producto ',
      message005: 'Ha eliminado el cliente ',
      message006: 'El producto ha sido elminado!',
      message007: 'Venta Exitosa!',
      message008: 'Eliminar Cliente',
      message009: 'Esta seguro de elminar el cliente ',
      message010: 'Eliminar Producto',
      message011: 'Esta seguro de elminar el producto ',
      message012: 'Nueva cantidad del producto ',
      message013: 'La cantidad no es correcta.',
      message014: 'Introduzca la cantidad por favor.',
      message015: 'Unidades.',
      message016: 'No hay productos en el carrito!, añada uno con los botones verdes.',
      message017: 'Ya existe un producto <%= product %> en el carrito!, por favor modifique el que ya existe',
      message018: 'El producto <%= product %> ya existe en la base de datos, por favor utilize otro nombre',
      message019: 'Hubo un problema con el servidor por favor contactese con su proveedor',
      message020: 'El usuario ha sido eliminado'
  })
