//import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Picker } from '@react-native-picker/picker';
import administrativeQuestionsData from "./assets/administrativeQuestionsData.json";
import BMPQuestionsData from "./assets/BMPQuestionsData.json";

const FormContext = React.createContext({});

/*==========================================================================*/
/* `App` is the outer-most component that encompasses all other components. */
/*==========================================================================*/
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Header></Header>

      <ScrollView>

        <Form>
          <FormSection>
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
          </FormSection>

          <FormSection title='Key Personnel'>
            <FormInput label='IQA Reviewer' />
            <FormInput label='Review Date' />
            <FormInput label='Resident Engineer (RE)' />
            <FormInput label='RE Phone No.' />
            <FormInput label='Review Participants' />
            <FormInput label='Construction Company' />
            <FormInput label='Water Pollution Control Manager (WPCM)' />
          </FormSection>

          <FormSection title='Site Conditions'>
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
          </FormSection>

          <FormSection title='Regulatory Status'>
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
          </FormSection>

          <AdministrationFinding findingNumber='1' />
          <BMPFinding findingNumber='1' />
        </Form>

        <Button style={styles.buttonGenerate} title='Generate PDF' />

      </ScrollView>

    </View>
  );
}

/*===================*/
/* Header Components */
/*===================*/

function Header() {
  return (
    <View style={styles.header}>
      <AppTitle />
    </View>
  );
} 

function AppTitle() {
  return (
    <Text style={styles.appTitle}>Project Construction Stormwater Report</Text>
  );
}

/*=================*/
/* Form components */
/*=================*/

function Form(props) {
  const [formData, setFormData] = useState({"findings": {A1: {}, B1: {}}});

  function updateFormData(name, value, findingNumber) {
    if(findingNumber) {
      if(!formData['findings'].hasOwnProperty(findingNumber)) {
        formData['findings'][findingNumber] = {};
      }
      if(name === "Administrative Category" || name === "BMP Category" || name === "BMP Type") {
        delete formData['findings'][findingNumber]['Question No.'];
        delete formData['findings'][findingNumber]['BMP Type'];
      }
      formData['findings'][findingNumber][name] = value;
    }
    else {
      formData[name] = value;
    }
    setFormData(Object.assign({}, formData));
  }

  return (
    <FormContext.Provider value={{formData, updateFormData}}>
      {props.children}
    </FormContext.Provider>
  );
}

function FormSection(props) {
  return (
    <View style={styles.formSection}>
      {
        props.title &&
        <Text style={styles.formTitle}>{props.title}</Text>
      }
      {props.children}
    </View>
  )
}

function FormInput(props) {
  const { formData, updateFormData } = useContext(FormContext); 
  var formInput;
  var name = props.label;
  var findingNumber = props.findingNumber;
  var value = findingNumber? (formData['findings'][findingNumber][props.label] || props.value || '') : (formData[props.label] || '');
  
  switch(props.type) {
    default:
    case 'text':
      formInput = <TextInput onChangeText={handleTextChange} style={styles.textbox} {...props} value={value} />;
    break;

    case 'textarea':
      formInput = <TextInput onChangeText={handleTextChange} style={styles.textbox} multiline numberOfLines={4} {...props} value={value} />;
    break;

    case 'select':
      formInput = <Picker onValueChange={handleSelectChange} style={styles.picker} selectedValue={value}>{props.children}</Picker>;
    break;
  }

  function handleTextChange(newValue) {
    updateFormData(name, newValue, props.findingNumber);
    //console.log('text change!', formData);
  }

  function handleSelectChange(newValue) {
    updateFormData(name, newValue, props.findingNumber);
    //console.log(formData);
  }

  return (
    <View style={styles.formInput}>
      <Text>{props.label}</Text>
      { formInput }
    </View>
  );
}

/*=====================*/
/* Findings Components */
/*=====================*/

function AdministrationFinding(props) {
  const { formData, updateFormData } = useContext(FormContext);
  const findingNumber = "A" + props.findingNumber;
  var administrativeCategory = formData['findings'][findingNumber]['Administrative Category'] || '';
  var administrativeQuestion = formData['findings'][findingNumber]['Question No.'] || '';
  
  var standards;
  if(administrativeQuestion) {
    var question = administrativeQuestionsData[administrativeCategory]['questions'][administrativeQuestion];
    standards = Object.keys(question['standards']).map((key, i)=>
      <View key={i} style={{marginBottom: 8}}>
        <Text style={{fontWeight: 'bold'}}>{key}</Text>
        <Text>{question['standards'][key]}</Text>
      </View>
    )
  }

  return (
    <FormSection title='Stormwater Contract Administration Finding'>
      <View style={{marginVertical: 8}}>
        <Text>Finding No.</Text>
        <Text style={styles.findingNumber}>{findingNumber}</Text>
      </View>
      <FormInput label='Administrative Category' findingNumber={findingNumber} type='select' >
        <Picker.Item label='None' value='' />
        {
          Object.keys(administrativeQuestionsData).map(key=>
            <Picker.Item key={key} label={administrativeQuestionsData[key]['category']} value={key} />
          )
        }
      </FormInput>
      <FormInput label='Question No.' findingNumber={findingNumber} type='select' >
        <Picker.Item label='None' value='' />
        {
          administrativeCategory !== '' &&
          Object.keys(administrativeQuestionsData[administrativeCategory]['questions']).map(key=>
            <Picker.Item key={key} label={administrativeQuestionsData[administrativeCategory]['questions'][key]['question']} value={key} />
          )
        }
      </FormInput>
      { standards }
      <FormInput label='Observation' type='textarea' findingNumber={findingNumber} />
      
      <View style={styles.hr}></View>

      <FormInput label='Corrective Action' type='textarea' findingNumber={findingNumber} />
      <FormInput label='Date of Completion' findingNumber={findingNumber} />
      <FormInput label='Verified by' findingNumber={findingNumber} />
    </FormSection>
  );
}

function BMPFinding(props) {
  const { formData, updateFormData } = useContext(FormContext);
  const findingNumber = "B" + props.findingNumber;
  var BMPCategory = formData['findings'][findingNumber]['BMP Category'] || '';
  var BMPType = formData['findings'][findingNumber]['BMP Type'] || '';
  var BMPQuestion = formData['findings'][findingNumber]['Question No.'] || '';

  var standards;
  if(BMPQuestion) {
    var question = BMPQuestionsData[BMPCategory]['types'][BMPType]['questions'][BMPQuestion];
    standards = Object.keys(question['standards']).map((key, i)=>
      <View key={i} style={{marginBottom: 8}}>
        <Text style={{fontWeight: 'bold'}}>{key}</Text>
        <Text>{question['standards'][key]}</Text>
      </View>
    )
  }
  return (
    <FormSection title='Construction Site BMP Finding'>
      <View style={{marginVertical: 8}}>
        <Text>Finding No.</Text>
        <Text style={styles.findingNumber}>B{props.findingNumber}</Text>
      </View>
      <FormInput label='BMP Category' type='select' findingNumber={findingNumber} >
        <Picker.Item label='None' value='' />
          {
            Object.keys(BMPQuestionsData).map(key=>
              <Picker.Item key={key} label={BMPQuestionsData[key]['category']} value={key} />
            )
          }
      </FormInput>
      <FormInput label='BMP Type' type='select' findingNumber={findingNumber} >
        <Picker.Item label='None' value='' />
          {
            BMPCategory !== '' &&
            Object.keys(BMPQuestionsData[BMPCategory]['types']).map(key=>
              <Picker.Item key={key} label={BMPQuestionsData[BMPCategory]['types'][key]['type']} value={key} />
            )
          }
      </FormInput>
      <FormInput label='Question No.' type='select' findingNumber={findingNumber} >
        <Picker.Item label='None' value='' />
          {
            BMPType !== '' &&
            Object.keys(BMPQuestionsData[BMPCategory]['types'][BMPType]['questions']).map(key=>
              <Picker.Item key={key} label={BMPQuestionsData[BMPCategory]['types'][BMPType]['questions'][key]['question']} value={key} />
            )
          }
      </FormInput>
      { standards }
      <FormInput label='Location' findingNumber={findingNumber} />
      <FormInput label='Observation' type='textarea' findingNumber={findingNumber} />
      
      <View style={styles.hr}></View>

      <FormInput label='Corrective Action' type='textarea' findingNumber={findingNumber} />
      <FormInput label='Date of Completion' findingNumber={findingNumber} />
      <FormInput label='Verified by' findingNumber={findingNumber} />
    </FormSection>
  );
}

/*==============*/
/* Data Objects */
/*==============*/



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
    fontSize: 30,
    fontStyle: 'italic',
    marginBottom: 20,
  },

  textbox: {
    backgroundColor: '#ffffff',
    borderColor: '#777',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },

  picker: {
    backgroundColor: '#ffffff',
    borderColor: '#777',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  formSection: {
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 12,
    marginBottom: 20,
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

  hr: {
    backgroundColor: '#aaa',
    height: 2,
    marginVertical: 8,
  },

  findingNumber: {
    fontWeight: 'bold',
    fontSize: 20
  },

  buttonGenerate: {
    borderRadius: 8,
  }

});


/*
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

getPDF();
*/