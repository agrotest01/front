<template>
  <context-holder />
  <a-divider orientation="center">Форма калькуляции суммы товара</a-divider>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 10 }"
    autocomplete="off"
    @finish="onFinish"
  >
    <a-form-item
      label="Товар"
      name="product_id"
      :rules="[{ required: true, message: 'Выберите товар!' }]"
    >
      <a-select v-model:value="formState.product_id" >
        <a-select-option v-for="i in productState" :key="i.id" :value="i.id">{{ i.name }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="Номер счета"
      name="tax_num"
      :rules="[{ required: true, message: 'Укажите номер счета!' }]"
    >
      <a-input v-model:value="formState.tax_num" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Посчитать</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import {onMounted, reactive} from 'vue';
  import { message } from 'ant-design-vue';
import axios from "axios";
  const [messageApi, contextHolder] = message.useMessage();

  interface FormState {
    tax_num: string;
    product_id: number | null;
  }

  const formState = reactive<FormState>({
    tax_num: '',
    product_id: null
  });

  interface ProductState {
    id: number;
    name: string;
  }

  const productState = reactive<[ProductState]>([])

  const onFinish = (values: any) => {
    axios.post('http://agro-service.local/api/order/final-price', {
      product_id: values['product_id'],
      tax_number: values['tax_num']
    }).then((response: { data: any }) => {
      messageApi.success(`Цена товара ${response.data.price} евро`);
    }).catch((error) => {
      messageApi.error(error.toString());
    })

  };

  const getProductList = async () => {
    axios.get('http://agro-service.local/api/product').then((response: { data: any }) => {
        for (const [i, item] of response.data.entries()) {
          productState.push({
            id: item.id,
            name: item.name
          })
        }
    })
  }

  onMounted(async () => {
      try {
          await getProductList();
      } catch (e) {
          messageApi.error(e.toString());
      }
  })

</script>