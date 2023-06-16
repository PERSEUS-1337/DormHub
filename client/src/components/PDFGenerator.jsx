import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print';

//dummy data
const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male" },
]

//put in here the component that must be generated
const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}> 
            <table>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                </tr>
                {data.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.name}</td>
                            <td>{val.age}</td>
                            <td>{val.gender}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
});

//the function component for generating pdf
const GeneratePDF = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
      <div>
        <ComponentToPrint ref={componentRef} />
        <button onClick={handlePrint}>Generate PDF</button>
      </div>
    );
};


