import * as React from "react";
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  DateField,
  DecimalField,
  IconClickAndCollectRegular,
  Inline,
  ResponsiveLayout,
  Stack,
  Text4,
  Text8,
  TextField,
  alert,
} from '@telefonica/mistica'
import styles from "./editar_produto.module.css";
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function EditProduct() {
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const router = useRouter();
  const toEditProductId = router.query.productId;

  const validateFields = () => {
    if(
      name.length < 2 ||
      brand.length < 2 ||
      description.length < 10 ||
      Number(price.replace(",", ".")) <= 0.01 
    ){
      return true;
    }else {
      return false;
    }
  }

  const handleEditProduct = async () => {
    try {
      await api.put(`/update/product/${toEditProductId}`, {
        name,
        brand,
        price: Number(price.replace(",", ".")),
        description
      });
      alert({
        title: "Atualização do produto 100%",
        message: "",
        acceptText: "Retornar",
        onAccept() { router.replace("/lista_produto") },
      });
    } catch (err) {
      console.log(err);
      alert({
        title: "Não foi possivel Alterar o Produto",
        message: "",
        acceptText: "Tentar-Novamente",
        onAccept() { router.replace("/lista_produto") },
      })
    }
  }

  const handleFormatDate = (date: string) => {
    const completeDate = new Date(date);
    let formattedMonth;
    let formattedDay;

    if(completeDate.getDate() > 9) {
      formattedDay = completeDate.getDate();
    }else {
      formattedDay = `0${completeDate.getDate()}`;
    }

    if(completeDate.getMonth() > 9) {
      formattedMonth = completeDate.getMonth();
    }else {
      formattedMonth = `0${completeDate.getMonth()}`;
    }

    return `${completeDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
  }

  const handleGetProductInfo = async () => {
    try {
      await api.get(`/get/product/${toEditProductId}`).then(res => {
        setName(res.data[0].name);
        setBrand(res.data[0].brand);
        setDescription(res.data[0].description);
        setPrice(res.data[0].price.toString());
      })
    } catch(err) {
      console.log(err);
      alert({
        title: "Não foi possivel Alterar o Produto",
        message: "",
        acceptText: "Finalizar",
        onAccept() { router.replace("/lista_produto") },
      })
    }
  }

  React.useEffect(() => {
    handleGetProductInfo();
  }, []);

return (
  <ResponsiveLayout className={styles.main}>
    <Box className={styles.centerContent}>
      <Stack space={0}>
        <Inline space={16} alignItems="center">
          <Text8>Alterar Produto</Text8>
        </Inline>
        <Stack space={0}>
          <Box paddingTop={32}>
            <TextField 
              label="Nome"
              name="product-name"
              value={name}
              onChangeValue={setName}
            />
          </Box>
          <Box paddingTop={16}>
            <TextField 
              label="Marca"
              name="product-brand"
              value={brand}
              onChangeValue={setBrand}
            />
          </Box>
          <Box paddingTop={16}>
            <TextField 
              label="Descrição"
              name="product-description"
              value={description}
              onChangeValue={setDescription}
              multiline
            />
          </Box>
          <Box paddingTop={16}>
            <DecimalField 
              label="Preço"
              name="product-price"
              value={price}
              onChangeValue={setPrice}
            />
          </Box>
        </Stack>
        <Box paddingTop={80}>
          <Inline space={16}>
            <ButtonSecondary onPress={router.back}>
              Cancelar
            </ButtonSecondary>
            <ButtonPrimary disabled={validateFields()} onPress={() => {handleEditProduct()}}>
              Atualizar
            </ButtonPrimary>
          </Inline>
        </Box>
      </Stack>
    </Box>
  </ResponsiveLayout>
);
}
