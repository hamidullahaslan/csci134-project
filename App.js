//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {Picker} from '@react-native-picker/picker';
import { bold } from 'ansi-colors';


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header></Header>
      <ScrollView>

        <FormFields>
          <FormInput label='Project Name' />
          <FormInput label='Project Description' type='textarea' />
          <FormInput label='Contract Number/CO/RTE/PM' />
          <FormInput label='District' type='select' >
            <Picker.Item label='None' value='' />
            <Picker.Item label='01' value='01' />
            <Picker.Item label='02' value='02' />
            <Picker.Item label='03' value='03' />
            <Picker.Item label='04' value='04' />
            <Picker.Item label='05' value='05' />
            <Picker.Item label='06' value='06' />
            <Picker.Item label='07' value='07' />
            <Picker.Item label='08' value='08' />
            <Picker.Item label='09' value='09' />
            <Picker.Item label='10' value='10' />
            <Picker.Item label='11' value='11' />
            <Picker.Item label='12' value='12' />
          </FormInput>
          <FormInput label='WDID Number' />
        </FormFields>

        <FormFields title='Key Personnel'>
          <FormInput label='IQA Reviewer' />
          <FormInput label='Review Date' />
          <FormInput label='Resident Engineer (RE)' />
          <FormInput label='RE Phone No.' />
          <FormInput label='Review Participants' />
          <FormInput label='Construction Company' />
          <FormInput label='Water Pollution Control Manager (WPCM)' />
        </FormFields>

        <FormFields title='Site Conditions'>
          <FormInput label='Weather Conditions' />
          <FormInput label='Project Risk Level/Tahoe CGP' type='select' >            
            <Picker.Item label='1' value='1' />
            <Picker.Item label='2' value='2' />
            <Picker.Item label='3' value='3' />
            <Picker.Item label='Tahoe' value='Tahoe' />
          </FormInput>
          <FormInput label='Receiver Water Body(s)' />
          <FormInput label='Percent Complete by Time' />
          <FormInput label='Total Disturbed Soil Area (DSA) (acres)' />
          <FormInput label='Active DSA (acres)' />
          <FormInput label='Inactive DSA (acres)' />
        </FormFields>

        <FormFields title='Regulatory Status'>
          <FormInput label='SWPPP or WPCP' type='select' >
            <Picker.Item label='None' value='' />
            <Picker.Item label='SWPPP' value='SWPPP' />
            <Picker.Item label='WPCP' value='WPCP' />
          </FormInput>
          <FormInput label='RWQCB(s)' type='textarea' />
          <FormInput label='PLACS (Permits, Licenses, Agreements, Certifications) Specifying Temporary BMP Requirements' type='textarea' />
          <FormInput label='Oversight Project?' type='select' >
            <Picker.Item label='Yes' value='yes' />
            <Picker.Item label='No' value='no' />
          </FormInput>
          <FormInput label='Lead Agency' />
        </FormFields>
        
      </ScrollView>
    </View>
  );
}


function Header() {
  return (
    <View style={styles.header}>
      <HeaderTitle />
    </View>
  );
} 

function HeaderTitle() {
  return (
    <Text style={styles.appTitle}>Project Construction Stormwater Report</Text>
  );
}

function FormFields(props) {
  return (
    <View style={styles.formFields}>
      {
        props.title &&
        <Text style={styles.formTitle}>{props.title}</Text>
      }
      {props.children}
    </View>
  )
}

function FormInput(props) {
  var formInput;

  switch(props.type) {
    default:
    case 'text':
      formInput = <TextInput style={styles.textbox} />;
    break;

    case 'textarea':
      formInput = <TextInput style={styles.textbox} multiline numberOfLines={4} />;
    break;

    case 'select':
      formInput = <Picker>{props.children}</Picker>;
    break;
  }

  return (
    <View style={styles.formInput}>
      <Text>{props.label}</Text>
      { formInput }
    </View>
  );
}




/*=============*/
/* Stylesheets */
/*=============*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    padding: 16
  },

  appTitle: {
    fontSize: 32,
    fontStyle: 'italic',
    marginBottom: 20
  },

  textbox: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 2
  },

  formFields: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8
  },

  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },

  formInput: {
    marginVertical: 8
  },

  header: {
    padding: 8
  },


});



async function getPDF() {
  const formUrl = require('./assets/sample.pdf');
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm()
  const fields = form.getFields()
  fields.forEach(field => {
    const type = field.constructor.name
    const name = field.getName()
    console.log(`${type}: ${name}`)
  });
}

//getPDF();