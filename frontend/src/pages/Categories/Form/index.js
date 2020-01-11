import React, {useState} from 'react';
import {toast} from 'react-toastify';

import {Button, makeStyles} from '@material-ui/core';
import {Form as UnForm} from '@rocketseat/unform';
import * as Yup from 'yup';

import InputButton from '~/components/InputButton';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';

const useStyles = makeStyles(theme => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const classes = useStyles();
  const [formType, setFormType] = useState('save');
  const buttonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  function handleSubmit(data, { resetForm }) {
    categoryHttp
      .create(data)
      .then(() => {
        toast.success('Categoria cadastrada com sucesso!');
        if (formType === 'save') {
          history.push('/categories');
        }
        if(formType === 'save-and-new'){
          resetForm();
        }
      })
      .catch(err => {
        const { errors } = err.response.data;
        if (errors) {
          const firstObj = Object.keys(errors)[0];
          toast.error(errors[firstObj][0]);
        }
      });
  }

  return (
    <>
      <h1>Adicionar uma nova categoria</h1>
      <UnForm schema={schema} onSubmit={handleSubmit}>
        <InputButton label="Nome" name="name"/>
        <InputButton
          label="Descrição"
          name="description"
          rows="6"
          margin="normal"
          multiline
        />
        <SwitchButton name="is_active" label="Ativo?" value={false}/>
        <div>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save')}
          >
            Salvar
          </Button>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save-and-new')}
          >
            Salvar e adicionar uma nova categoria
          </Button>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save-and-edit')}
          >
            Salvar e continuar editando
          </Button>
        </div>
      </UnForm>
    </>
  );
}
