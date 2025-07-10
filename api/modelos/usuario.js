import Usuario from "./usuariosModel.js";

const ejecutarCrearAdmin = async () => {
  const count = await Usuario.contarAdmins();
  if (count === 0) {
    await Usuario.crearAdmin();
  } else {
    console.log("Administrador ya existe");
  }
};

export default ejecutarCrearAdmin;
