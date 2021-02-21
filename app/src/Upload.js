import FileBase64 from 'react-file-base64';

import React, {Component} from 'react';
import { Button, FormGroup, FormText, Input } from 'reactstrap';
import './upload.css'


class Upload extends Component {
    constructor(props){
        super(props);

    this.state = { 

        confirmation: "",
        isLoading: "",
        files: "",
        name: "",
        Fathername: "",
        DOB: "",
        PAN: ""
    }

    this.handleChange = this.handleChange.bind(this);
}
    handleChange(event){
        event.preventDefault();
        const target= event.target;
        const value = target.value;
        const name = target.name;

        this.setState({name:value});
    };

    async handleSubmit(event){
        event.preventDefault();
        this.setState({confirmation : "Uploading..."}); 
    }

    async getFiles(files){
        this.setState({
            isLoading: "Extracting data...",
            files: files});
   

    const UID = Math.round(1+Math.random()*(1000000000-1));

    var data = {
        fileExt:"png",
        imageID: UID,
        folder: UID,
        img: this.state.files[0].base64
    };

    this.setState({confirmation: "Processing........."});

    await fetch('https://wcz15rlfn0.execute-api.us-east-2.amazonaws.com/PanProd',
    {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application.json"
        },
        body: JSON.stringify(data)
    });

    const targetImage = UID+".png";
    const response = await fetch('https://wcz15rlfn0.execute-api.us-east-2.amazonaws.com/PanProd/ocr',
    {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application.json"
        },
        body: JSON.stringify(targetImage)
    });

    this.setState({confirmation: ""});
    const OCRBody = await response.json();
    console.log("OCRBody ",OCRBody);

    this.setState({name: OCRBody.body[0]});
    this.setState({Fathername: OCRBody.body[1]});
    this.setState({DOB: OCRBody.body[2]});
    this.setState({PAN: OCRBody.body[3]});

}
    render(){
        const processing = this.state.confirmation;
        return ( 
            <div className="row">
                <div className="col-6 offset-3">
                <form onSubmit={this.handleSubmit} >
                    <FormGroup>
                        <h3 className="text-danger">{processing}</h3>
                        <h6> Upload Pan Card</h6>
                        <FormText color="muted">PNG,JPG</FormText>
                    </FormGroup>



                       <div className="form-group files color">
                    <FileBase64 
                    multiple={true}
                    onDone={this.getFiles.bind(this)}></FileBase64>
                </div>

                <FormGroup>
                        <label>
                            <h6>Name</h6>
                        </label>

                        <Input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
          
                    <FormGroup>
                        <label>
                            <h6>Fathername</h6>
                        </label>

                        <Input
                            type="text"
                            name="Fathername"
                            id="Fathername"
                            required
                            value={this.state.Fathername}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
          

                    <FormGroup>
                        <label>
                            <h6>DOB</h6>
                        </label>

                        <Input
                            type="text"
                            name="DOB"
                            id="DOB"
                            required
                            value={this.state.DOB}
                            onChange={this.handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>
                            <h6>PAN</h6>
                        </label>

                        <Input
                            type="text"
                            name="PAN"
                            id="PAN"
                            required
                            value={this.state.PAN}
                            onChange={this.handleChange}
                        />
                    </FormGroup>

                    
                    <Button className="btn btn-lg btn-block btn-success">Submit</Button>
                </form>
                </div>
            </div>
        );
    }
}

export default Upload;