import styled from "styled-components";

export const PrimaryActionButton = styled.button`
    cursor: pointer;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
    padding: .5rem 1rem;
    margin: .5rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    
    :hover {
      color: #fff;
      background-color: #0069d9;
      border-color: #0062cc;
    }
`;