import React, { Component } from 'react';

class Docs extends Component {
    render() {
        return(
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.docs.map((doc) => 
                        <tr key={doc.hash}>
                            <td>{doc.name}</td>
                            <td>{doc.timestamp}</td>
                            <td>{doc.hash}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default Docs;