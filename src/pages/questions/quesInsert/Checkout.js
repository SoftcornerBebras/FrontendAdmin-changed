import React from "react";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Alert from '@material-ui/lab/Alert'
import {Snackbar,Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, CircularProgress} from '@material-ui/core';
import Review from "./Review";
import Background,{ setDataB, requiredBackground  } from "./Background";
import QuestionsForm,{ setDataQues } from "./QuestionsForm";
import AnswersForm,{ setDataAnswers, requiredAnswersForm } from "./AnswersForm";
import AnswerExplanation,{ setAnsExp } from "./AnswerExplanation"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';
import {quesInfo, quesString, options, answer } from './Review'
import {ageGroupIDValue} from './Background'
import axios from 'axios';
import {baseURL} from '../../constants'

export const errorArr = [
  { name: "Step1", desc: ""},
  { name: "Step2", desc: ""},
  { name: "Step3", desc: ""},
  { name: "Step4", desc: ""}
];

const styles =theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginLeft: "160px",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      width:'900px',
      marginTop: theme.spacing(6),
      marginLeft: "2%",
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
});

const steps = [
  "Question Details",  //0
  "Question Explanation",   //1
  "Answers Details",        //2
  "Answer Explanation",     //3
  "Review Question"     //4
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Background />;
    case 1:
      return <QuestionsForm />
    case 2:
      return <AnswersForm />;
    case 3:
      return <AnswerExplanation />;
    case 4:
      return <Review />;
  }
}
export let domains=[],skills=[],
      types=[],countries=[],
      quesLevels=[],
      ageGroups=[],
      ageGroupsID=[],
      languages=[];
class CheckOut extends React.PureComponent {

  state={
    activeStep:0,
    onClick:false,
    emailID : "",
    errorEmailID : false,
    open : false,
    openAge: false,
    isProcessing:false,
    uploadSuccess:false,
    rerender:false,
    openError:false
  }

   async componentDidMount(){

    countries=[];
    domains=[];skills=[];types=[];quesLevels=[];ageGroups=[];ageGroupsID=[];languages=[];
    try{
    let gCountries = await axios.get(baseURL+'api/com/getCountry/',{
        headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

    for(let i = 0; i<gCountries.data.length ; i++) {
        countries.push(gCountries.data[i].nicename);
    }

    let gDomain = await axios.get(baseURL+'api/com/getDomain/',{
        headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
      this.setState({openError:true})
    });

    for(let i = 0; i<gDomain.data.length ; i++) {
        domains.push(gDomain.data[i].codeName);
    }

    let gSkills = await axios.get(baseURL+'api/com/getSkills/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
         this.setState({openError:true})
    });

    for(let i = 0; i<gSkills.data.length ; i++) {
        skills.push(gSkills.data[i].codeName);
    }

    let gType = await axios.get(baseURL+'api/com/getQuestionType/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
         this.setState({openError:true})
    });

    for(let i = 0; i<gType.data.length ; i++) {
        types.push(gType.data[i].codeName);
    }

    let gQuesLevel = await axios.get(baseURL+'api/com/getQuestionLevel/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

    for(let i = 0; i<gQuesLevel.data.length ; i++) {
        quesLevels.push(gQuesLevel.data[i].codeName);
    }

    let gLanguage = await axios.get(baseURL+'api/com/getLanguage/',{
        headers:{
           'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
       this.setState({openError:true})
    });

    for(let i = 0; i<gLanguage.data.length ; i++) {
        languages.push(gLanguage.data[i].codeName);
    }

    let gAgeGroup = await axios.get(baseURL+'api/cmp/viewAgeGroup/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
         this.setState({openError:true})
    });

    for(let i = 0; i<gAgeGroup.data.length ; i++) {
        ageGroups.push(gAgeGroup.data[i].AgeGroupName);
        ageGroupsID.push(gAgeGroup.data[i].AgeGroupID);
    }
    if(gAgeGroup.data=="Redirect")
    {
       this.setState({openAge:true})
    }
    this.clearData()
    this.setState({rerender:true})
}catch(error){this.props.history.push('/app/dashboard')}
  }

handleClose = () => {
    this.setState({open:false,activeStep:4,isProcessing:false});
  };

  displayAlertAgeGroups = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.openAge} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Age Groups have not been created for this year.
              You will be redirected to "Create Age Groups" page. </Typography>
            </DialogContentText>
            </DialogContent>
           <DialogActions>
            <Button onClick={this.redirectToAgeGroups} color="primary">
              OK
            </Button>
          </DialogActions>
       </Dialog>
      </React.Fragment>
    );
  };

  displayAlert = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Do you really want to add the question?</Typography>
            </DialogContentText>
            </DialogContent>
           <DialogActions>
            {this.state.isProcessing ? (
            <CircularProgress size={26} />
            ) : (
            <Button onClick={this.insertQues} color="primary">
              Yes
            </Button>
            )}
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
          </DialogActions>
       </Dialog>
      </React.Fragment>
    );
  };
  insertQues = () => {
    this.setState({isProcessing:true});
  if(quesInfo[5].detail.toUpperCase()=='MCQS')
    {
      var body="";
      let content = quesString[0].question
      let imgs=content.match(/src/g)
      let total="",totalAns=""
      let replaceImg=[], sub1=[], sub2=[];
      let imgName=[], imgNameConcat="",uploadedURL="",imgType="";
      let imgNameAns=[], imgNameConcatAns="",uploadedURLAns="",imgTypeAns="";
      let imagesToUpload=[],imagesToUploadAns=[]
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds();
      let finalDate = date + '_' + time;

      if(imgs== null) {
        total=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            sub1[0] = sub1[0].substring(0,sub1[0].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[0].substring(sub1[0].search("img")+3,)
            var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
            var imgn = name.split(".");
            imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imagesToUpload[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
            imgNameConcat = imgName[i];
            imgType = "imageQuestion";
            uploadedURL = imgName[i];
            replaceImg[0] = "=\""+baseURL+"media/images/"+imgName[i]+"\" "
            sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
            total = sub1[0]+replaceImg[0]
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            sub1[i] = sub1[i].substring(0,sub1[i].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[i].substring(sub1[i].search("img")+3,)
            imagesToUpload[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
            var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
            var imgn = name.split(".");
            imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imgNameConcat = imgNameConcat +","+imgName[i];
            imgType += ",imageQuestion";
            uploadedURL += ",media/images/"+ imgName[i];
            replaceImg[i] = baseURL+"media/images/"+imgName[i]+"\" "
            total += sub1[i] + replaceImg[i]
          }
        }
        total = total+sub2[countOfImgs-1]
      }

      content = quesString[1].question
      imgs=quesString[1].question.match(/src/g)
      if(imgs==null) {
        totalAns=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            sub1[0] = sub1[i].substring(0,sub1[0].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[0].substring(sub1[0].search("img")+3,)
            var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
            var imgn = name.split(".");
            imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imagesToUploadAns[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
            imgNameConcatAns = imgNameAns[i];
            imgTypeAns = "imageAnsExplanation";
            uploadedURLAns = imgNameAns[i];
            replaceImg[0] = "=\""+baseURL+"media/images/"+imgNameAns[i]+"\" "
            sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
            totalAns = sub1[0]+replaceImg[0]
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            sub1[i] = sub1[i].substring(0,sub1[i].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[i].substring(sub1[i].search("img")+3,)
            imagesToUploadAns[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
            var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
            var imgn = name.split(".");
            imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imgNameConcatAns = imgNameConcatAns +","+imgNameAns[i];
            uploadedURLAns += ",media/images/"+ imgNameAns[i];
            imgTypeAns += ",imageAnsExplanation";
            replaceImg[i] = baseURL+"media/images/"+imgNameAns[i]+"\" "
            totalAns += sub1[i] + replaceImg[i]
          }
        }
        totalAns = totalAns+sub2[countOfImgs-1]
      }

        var bodyFormData = new FormData();
        var correctOpt = ""

        this.returnBLOB(imagesToUpload,imgName,bodyFormData)
        this.returnBLOB(imagesToUploadAns,imgNameAns,bodyFormData)

        if(answer[0].desc==""){
            correctOpt=""
        } else {
            correctOpt=options[answer[0].desc-1].desc
        }
        body={
            "questionTranslationID":{
      "questionID":{
         "countryID": {
            "nicename" : quesInfo[0].detail
         },
         "domainCodeID":{
            "codeName" : quesInfo[4].detail
         },
         "questionTypeCodeID":{
            "codeName" : quesInfo[5].detail
         }
      },
      "languageCodeID":{
         "codeName" : quesInfo[8].detail
      },
      "modified_by":localStorage.getItem('username'),
      "Identifier" : quesInfo[1].detail,
      "translation":{
         "translation":{
            "caption" : quesInfo[2].detail,
            "background" : total,
            "explanation" : totalAns
         },
         "quesAgeID":{
            "QuestionAgeID":{
               "AgeGroupName": quesInfo[6].detail,
               "AgeGroupID": ageGroupIDValue.toString()
            },
            "questionLevelCodeID":{
               "codeName":quesInfo[7].detail
            }
         },
         "quescsskills": quesInfo[3].detail,
              "imageID":{
                  "ImageName":imgNameConcat,
                  "ImageTypeCodeID":
                  {
                    "codeName":imgType
                  },
                  "uploadedFile":"media/images/"+uploadedURL
              },
           "imageAnsID":{
                  "ImageName":imgNameConcatAns,
                  "ImageTypeCodeID":
                  {
                    "codeName":imgTypeAns
                  },
                  "uploadedFile":"media/images/"+uploadedURLAns
              }

          }
            },
            "optionTranslationID":{
      "languageCodeID":{
         "codeName" : quesInfo[8].detail.toLowerCase()
      },
      "translationO":    {
         "translationO":
         {
         "option1":{
               "caption":{
                  "option":options[0].desc
               }
            },
            "option2":{
               "caption":{
               "option":options[1].desc
               }
            },
            "option3":{
               "caption":{
               "option":options[2].desc
               }
            },
            "option4":{
               "caption":{
               "option":options[3].desc
               }
            },
            "correctOption":correctOpt,
            "ansText": answer[1].desc
                    }

                }
            }
        };

        bodyFormData.append('data', JSON.stringify(body));
        try{
        setTimeout(()=>{
        axios({
        method: 'post',
        url: baseURL+'api/cmp/insertMcqQues/',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data',
                Authorization: "Token "+localStorage.getItem('id_token')}
        })
        .then(response =>{
          this.clearData();
          setTimeout(()=>{
            this.setState({uploadSuccess:true,isProcessing:false,open:false,activeStep:5});
          },2000);
          setTimeout(()=>{
            this.redirect();
          },2000);
        })

        },10000)
        }catch(error) {
            axios.get(baseURL+'api/cmp/rollBackQuestion/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }).catch(error=>{})
            this.setState({openError:true,isProcessing:false,open:false,activeStep:4});
        }

    }
    else if(quesInfo[5].detail.toUpperCase()=='MCQS_WITH_IMAGES')
    {
        let content = quesString[0].question
        let imgs=content.match(/src/g)
        let replaceImg=[], sub1=[], sub2=[] , total, height=[] ,totalAns="";
        let imgName=[], imgNameConcat="",uploadedURL="",imgType="";
        let imgNameAns=[], imgNameConcatAns="",uploadedURLAns="",imgTypeAns="";
        let imagesToUpload=[],imagesToUploadAns=[]
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds();
        let finalDate = date + '_' + time;
   if(imgs== null) {
        total=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
            var imgn = name.split(".");
            imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imagesToUpload[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
            imgNameConcat = imgName[i];
            imgType = "imageQuestion";
            uploadedURL = imgName[i];
            replaceImg[0] = "=\""+baseURL+"media/images/"+imgName[i]+"\" "
            sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
            total = sub1[0]+replaceImg[0]
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            imagesToUpload[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
            var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
            var imgn = name.split(".");
            imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imgNameConcat = imgNameConcat +","+imgName[i];
            imgType += ",imageQuestion";
            uploadedURL += ",media/images/"+ imgName[i];
            replaceImg[i] = baseURL+"media/images/"+imgName[i]+"\" "
            total += sub1[i] + replaceImg[i]
          }
        }
        total = total+sub2[countOfImgs-1]
      }
      content = quesString[1].question
      imgs=quesString[1].question.match(/src/g)
      if(imgs==null) {
        totalAns=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
            var imgn = name.split(".");
            imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imagesToUploadAns[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
            imgNameConcatAns = imgNameAns[i];
            imgTypeAns = "imageAnsExplanation";
            uploadedURLAns = imgNameAns[i];
            replaceImg[0] = "=\""+baseURL+"media/images/"+imgNameAns[i]+"\" "
            sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
            totalAns = sub1[0]+replaceImg[0]
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            imagesToUploadAns[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
            var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
            var imgn = name.split(".");
            imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
            imgNameConcatAns = imgNameConcatAns +","+imgNameAns[i];
            uploadedURLAns += ",media/images/"+ imgNameAns[i];
            imgTypeAns += ",imageAnsExplanation";
            replaceImg[i] = baseURL+"media/images/"+imgNameAns[i]+"\" "
            totalAns += sub1[i] + replaceImg[i]
          }
        }
        totalAns = totalAns+sub2[countOfImgs-1]
      }

      let imgNameOpt=[],pos=[]
      for(let i=0;i<options.length;i++){
        if( options[i].price != ""){
          var imgn = options[i].price.name.split(".");
          imgNameOpt[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
          pos[i]=i
        }else{
          imgNameOpt[i]=""
        }
      }

        // var imgn1 = options[0].price.name.split( ".");
        // var imgn2 = options[1].price.name.split( ".");
        // var imgn3 = options[2].price.name.split( ".");
        // var imgn4 = options[3].price.name.split( ".");
        // let imgName1 = imgn1[0]+'_'+finalDate+'.'+imgn1[1];
        // let imgName2 = imgn2[0]+'_'+finalDate+'.'+imgn2[1];
        // let imgName3 = imgn3[0]+'_'+finalDate+'.'+imgn3[1];
        // let imgName4 = imgn4[0]+'_'+finalDate+'.'+imgn4[1];
        var bodyFormData = new FormData();

        this.returnBLOB(imagesToUpload,imgName,bodyFormData)
        this.returnBLOB(imagesToUploadAns,imgNameAns,bodyFormData)

        var body={
            "questionTranslationID":{
              "questionID":{
                "countryID": {
                  "nicename" : quesInfo[0].detail
                },
                "domainCodeID":{
                  "codeName" : quesInfo[4].detail
                },
                "questionTypeCodeID":{
                  "codeName" : quesInfo[5].detail
                }
              },
              "languageCodeID":{
                "codeName" : quesInfo[8].detail
              },
              "modified_by":localStorage.getItem('username'),
              "Identifier" : quesInfo[1].detail,
              "translation":{
                "translation":{
                  "caption" : quesInfo[2].detail,
                  "background" : total,
                  "explanation" : totalAns
                },
                "quesAgeID":{
                  "QuestionAgeID":{
                    "AgeGroupName": quesInfo[6].detail,
                    "AgeGroupID": ageGroupIDValue.toString()
                  },
                  "questionLevelCodeID":{
                    "codeName":quesInfo[7].detail
                  }
                },
                "quescsskills": quesInfo[3].detail,
                    "imageID":{
                        "ImageName":imgNameConcat,
                        "ImageTypeCodeID":
                        {
                          "codeName":imgType
                        },
                        "uploadedFile":"media/images/"+uploadedURL
                    },
                     "imageAnsID":{
                        "ImageName":imgNameConcatAns,
                        "ImageTypeCodeID":
                        {
                          "codeName":imgTypeAns
                        },
                        "uploadedFile":"media/images/"+uploadedURLAns
                    }
                }
            },
            "optionTranslationID":{
              "languageCodeID":{
                "codeName" : quesInfo[8].detail.toLowerCase()
              },
              "translationO":{
                "translationO":
                {
                  "option1":{
                    "caption":{
                       "option":options[0].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[0],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[0]
                }
                  },
                  "option2":{
                    "caption":{
                       "option":options[1].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[1],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[1]
                }

                  },
                  "option3":{
                    "caption":{
                    "option":options[2].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[2],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[2]
                }

                  },
                  "option4":{
                    "caption":{
                    "option":options[3].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[3],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[3]
                }
                  },
                  "correctOption":options[answer[0].desc-1].desc,
                              }

                          }
                      }
        };
        bodyFormData.append('data', JSON.stringify(body));
        for(let i=0;i<pos.length;i++){
          bodyFormData.append('image', options[pos[i]].price,imgNameOpt[pos[i]]);
        }
        // bodyFormData.append('image', options[0].price,imgName1);
        // bodyFormData.append('image', options[1].price,imgName2);
        // bodyFormData.append('image', options[2].price,imgName3);
        // bodyFormData.append('image', options[3].price,imgName4);
       try{
       setTimeout(()=>{
        axios({
        method: 'post',
        url: baseURL+'api/cmp/insertMcqWithImgsQues/',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data',
          Authorization: "Token "+localStorage.getItem('id_token')}
        })
         .then(response =>{
          this.clearData();
          setTimeout(()=>{
            this.setState({uploadSuccess:true,isProcessing:false,open:false,activeStep:5});
            localStorage.setItem("insertStatus","Complete");
          },2000);
          setTimeout(()=>{
            this.redirect();
          },2000);
        })
        },10000)
        }catch(error){
            axios.get(baseURL+'api/cmp/rollBackQuestion/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }).catch(error=>{})
            this.setState({openError:true,isProcessing:false,open:false,activeStep:4});
        }
    }
  };

   async returnBLOB(imagesToUpload,imgName,bodyFormData){

      for(let i=0;i<imagesToUpload.length;i++){
        let img = await fetch(imagesToUpload[i]).then(r => r.blob());
        const contentType = 'image/'+imgName[i].split('.')[1]
        const file = new File([img],imgName[i],{type: contentType},{lastModified: Date.now()})
        bodyFormData.append('image', file,imgName[i]);
      }
    }
    clearData = () => {
      options[0].desc="";options[0].price="";options[0].imgURL="";
      options[1].desc="";options[1].price="";options[1].imgURL="";
      options[2].desc="";options[2].price="";options[2].imgURL="";
      options[3].desc="";options[3].price="";options[3].imgURL="";
      quesString[1].question=null;
      quesString[0].question=null;quesInfo[0].detail="";quesInfo[1].detail="";quesInfo[2].detail="";quesInfo[3].detail="";
      quesInfo[4].detail="";quesInfo[5].detail="";quesInfo[6].detail="";quesInfo[7].detail="";quesInfo[8].detail="";
      answer[1].desc="";answer[0].desc="";answer[0].price="";
    }

    handleNext = () => {

    switch (this.state.activeStep) {
      case 0:
        requiredBackground();
        if (errorArr[0].desc === "error") return;
        break;

      case 2:
        requiredAnswersForm();
        if (errorArr[2].desc === "error") return;
        break;

    }
    this.setState({activeStep:this.state.activeStep + 1});
    switch (this.state.activeStep) {
       case 0:
        return setDataB();
      case 1:
        return setDataQues();
      case 2:
        return setDataAnswers();
      case 3:
        return setAnsExp();
      case 4:
        if(this.state.openAge==false)
         {
             return this.setState({open:true});
         }
         else
         {
             return this.setState({openAge:true});
         }
       case 5: return;
    }
  };

   handleBack = () => {
    this.setState({activeStep:this.state.activeStep - 1});
  };

   redirect = () => {
    setTimeout(()=>{this.setState({onClick:true})},2000)
   }

redirectToAgeGroups = () => {
    this.setState({onClickAge:true})
   }
handleAlertClose=()=>{
    this.setState({openError:false})
}
  render(){
    const { classes } = this.props;
    return (

      <React.Fragment>
        {this.displayAlertAgeGroups()}
        <Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
        </Alert>
      </Snackbar>
        {this.state.onClickAge? <Redirect to="/app/competitions/addGroups" /> : null}
        {this.state.onClick? <Redirect to="/app/questions" /> : null}
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Question
            </Typography>
            <Stepper
              activeStep={this.state.activeStep}
              className={classes.stepper}
              alternativeLabel
            >
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {this.state.activeStep === steps.length ? (
                <React.Fragment>
                  {this.state.open ? (
                  <Typography style={{marginLeft:'30%'}} variant="h5" gutterBottom>
                    Processing...
                  </Typography>
                  ) : (
                    <Typography style={{marginLeft:'30%'}} variant="h5" gutterBottom>
                    Your question has been added successfully.
                  </Typography>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.state.rerender ? getStepContent(this.state.activeStep) : null}
                  <div className={classes.buttons}>
                    {this.state.activeStep !== 0 && (
                      <Button onClick={this.handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {this.state.activeStep === steps.length - 1
                        ? "Confirm question"
                        : "Next"}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
            {this.displayAlert()}
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

CheckOut.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckOut);
