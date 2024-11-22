import os
from datetime import datetime
import pandas as pd


def export_data_to_excel(data, purposes):
    """
    Export experiment data to an Excel file.

    Parameters:
        data (dict): A dictionary containing the experiment data. 
                     Expected keys: 'creator', 'experimentName', 'matrixSize', 'records'.

    Returns:
        tuple: The filename and absolute path of the generated Excel file.
    """
    # Create folder for saving files
    if purposes == 'feedback':
        folder_name = "Feedback Data"

        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        # Extract details from the input data
        creator = data.get('creator', 'Creator')
        experiment_name = data.get('experimentName', 'Experiment')
        matrix_size = data.get('matrixSize', 'Size')
        lor = data.get('levelOfRecognition', 'Level of Recognition')
        stageNumber = data.get('stageNumber', 'Stage Number')
        totalNodes = data.get('totalNodes', 'Total Nodes')
        config = data.get('config', [])
        matrixGrid = data.get('matrixGrid', [])

        # Generate the filename with timestamp
        filename = os.path.join(
            folder_name, datetime.now().strftime('%Y-%m-%d %H' + "h" + '%M' + 'p') + '.xlsx'
        )

        # Generate the sheet name
        sheet_name = f"{experiment_name} - {matrix_size}x{matrix_size} - {creator}"

        # Convert config to a DataFrame
        df = pd.DataFrame(config, columns=[
            'Index', 'Node_number', 'Intensity', 'Duration', 'Order'])

        # Convert matrixGrid to a DataFrame
        df2 = pd.DataFrame(matrixGrid, columns=[
            'index', 'nodeNumber', 'pressedCount'])

        # combine columns
        df3 = pd.concat([df, df2], axis=1)

        # add additional columns
        df3['Level of Recognition'] = lor
        df3['Stage Number'] = stageNumber
        df3['Total Nodes'] = totalNodes

        # but not repeat the row values for the additional columns
        df3.loc[1:, 'Level of Recognition'] = ''
        df3.loc[1:, 'Stage Number'] = ''
        df3.loc[1:, 'Total Nodes'] = ''

        # Write to Excel file
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df3.to_excel(writer, index=False, sheet_name=sheet_name)

        # Return the filename and absolute path
        return filename, os.path.abspath(filename)

        # Write to Excel fil
    else:
        folder_name = "Experiment Data"
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        # Extract details from the input data
        creator = data.get('creator', 'Creator')
        experiment_name = data.get('experimentName', 'Experiment')
        matrix_size = data.get('matrixSize', 'Size')
        records = data.get('records', [])

        # Generate the filename with timestamp
        filename = os.path.join(
            folder_name, datetime.now().strftime('%Y-%m-%d %H' + "h" + '%M' + 'p') + '.xlsx'
        )

        # Generate the sheet name
        sheet_name = f"{experiment_name} - {matrix_size}x{matrix_size} - {creator}"

        # Convert records to a DataFrame
        df = pd.DataFrame(records, columns=[
                          'Index', 'Node_number', 'Intensity', 'Duration', 'Order'])

        # Write to Excel file
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name=sheet_name)

        # Return the filename and absolute path
        return filename, os.path.abspath(filename)
