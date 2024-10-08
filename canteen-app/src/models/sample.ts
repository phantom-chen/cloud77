import { Subject } from "rxjs";

export const MessageQueue$: Subject<string> = new Subject();
export class SampleService {
  public static getPosts() {
    
  }
}

export const SimpleFDCode: string = `
<FunctionDiagram>
  <Pages>
    <Layout FormatName="A3" Orientation="Landscape" Unit="0.01 mm" Width="29700" Height="42000"></Layout>
    <Page PageName="" PageNo="1">
      <Blocks>
        <Invocation Name="add(1)" DataFlowOrder="1" ENPort="false" Id="0f6be3bb-e95c-4370-a02b-76a5ae20e515">
          <Layout X="7451" Y="6096" Height="1185" Width="677">
            <Ports>
              <Port Name="IN1" Visible="true"></Port>
              <Port Name="IN2" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <DataRef Name="var(1)" Id="0f6be3bb-e95c-4370-a02b-76a5ae20e515">
            <Layout X="7451" Y="6096" Height="1185" Width="677"></Layout>
        </DataRef>
        <PageConnector Name="PC4" Direction="in" PageNo="2" Id="">
          <Layout X="5122" Y="6435" DisplayName="demo"></Layout>
        </PageConnector>
      </Blocks>
      <DataConnections>
        <DataConnection Id="6b7afe38-8157-46fa-8eba-b6d7f3de9dbf" Src="PC4" Dest="add(1).IN1">
          <Layout>
            <SrcPos X="6181" Y="6604"></SrcPos>
            <DestPos X="7239" Y="6604"></DestPos>
          </Layout>
        </DataConnection>
      </DataConnections>
    </Page>
  </Pages>
</FunctionDiagram>
`;

export const SampleFDCode: string = `
<FunctionDiagram>
  <Pages>
    <Layout FormatName="A3" Orientation="Landscape" Unit="0.01 mm" Width="29700" Height="42000"></Layout>
    <Page PageName="" PageNo="1">
      <Blocks>
        <Invocation Name="add(1)" DataFlowOrder="1" ENPort="false" Id="0f6be3bb-e95c-4370-a02b-76a5ae20e515">
          <Layout X="7451" Y="6096" Height="1185" Width="677">
            <Ports>
              <Port Name="IN1" Visible="true"></Port>
              <Port Name="IN2" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <Invocation Name="add(2)" DataFlowOrder="2" ENPort="false" Id="064fc8b7-8592-46a2-afe3-5493f0297369">
          <Layout X="7472" Y="9102" Height="1185" Width="677">
            <Ports>
              <Port Name="IN1" Visible="true"></Port>
              <Port Name="IN2" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <PageConnector Name="PC4" Direction="in" PageNo="2" Id="">
          <Layout X="5122" Y="6435" DisplayName="demo"></Layout>
        </PageConnector>
      </Blocks>
      <DataConnections>
        <DataConnection Id="6b7afe38-8157-46fa-8eba-b6d7f3de9dbf" Src="PC4" Dest="add(1).IN1">
          <Layout>
            <SrcPos X="6181" Y="6604"></SrcPos>
            <DestPos X="7239" Y="6604"></DestPos>
          </Layout>
        </DataConnection>
        <DataConnection Id="d61d7c88-4385-4a20-bf30-cee15184ab18" Src="PC4" Dest="add(2).IN1">
          <Layout>
            <SrcPos X="6181" Y="6604"></SrcPos>
            <LinePos DX="540" DY="0"></LinePos>
            <LinePos DX="0" DY="3006"></LinePos>
            <DestPos X="7260" Y="9610"></DestPos>
          </Layout>
        </DataConnection>
      </DataConnections>
    </Page>
    <Page PageName="" PageNo="2">
      <Blocks>
        <Invocation Name="add(3)" DataFlowOrder="1" ENPort="false" Id="7228e718-bdfe-41f7-90d0-87d7b3921311">
          <Layout X="7451" Y="6096" Height="1185" Width="677">
            <Ports>
              <Port Name="IN1" Visible="true"></Port>
              <Port Name="IN2" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <PageConnector Name="PC4" Direction="out" PageNo="1" Id="">
          <Layout X="9483" Y="6435" DisplayName="demo"></Layout>
        </PageConnector>
      </Blocks>
      <DataConnections>
        <DataConnection Id="cf41f1f5-8961-4fe7-891a-22ae4f0e3094" Src="add(3)" Dest="PC4">
          <Layout>
            <SrcPos X="8340" Y="6604"></SrcPos>
            <DestPos X="9271" Y="6604"></DestPos>
          </Layout>
        </DataConnection>
      </DataConnections>
    </Page>
    <Page PageName="" PageNo="3">
      <Blocks>
        <Invocation Name="add(4)" DataFlowOrder="1" ENPort="false" Id="27510ff1-f91e-4941-a0a9-c92513e12e98">
          <Layout X="7451" Y="6096" Height="1185" Width="677">
            <Ports>
              <Port Name="IN1" Visible="true"></Port>
              <Port Name="IN2" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <PageConnector Name="PC1" Direction="out" PageNo="4" Id="">
          <Layout X="9483" Y="6435"></Layout>
        </PageConnector>
      </Blocks>
      <DataConnections>
        <DataConnection Id="3289f93c-0ec3-4b88-9231-bd1fc73956ea" Src="add(4)" Dest="PC1">
          <Layout>
            <SrcPos X="8340" Y="6604"></SrcPos>
            <DestPos X="9271" Y="6604"></DestPos>
          </Layout>
        </DataConnection>
      </DataConnections>
    </Page>
    <Page PageName="" PageNo="4">
      <Blocks>
        <Invocation Name="abs(1)" DataFlowOrder="1" ENPort="false" Id="71cd0710-2418-49c0-bf5d-6db463706ca4">
          <Layout X="7451" Y="6096" Height="847" Width="677">
            <Ports>
              <Port Name="IN" Visible="true"></Port>
              <Port Name="" Visible="true"></Port>
            </Ports>
          </Layout>
        </Invocation>
        <PageConnector Name="PC1" Direction="in" PageNo="3" Id="">
          <Layout X="5122" Y="6435"></Layout>
        </PageConnector>
      </Blocks>
      <DataConnections>
        <DataConnection Id="2e9a1aec-caf0-483f-97fe-fc0057092e72" Src="PC1" Dest="abs(1).IN">
          <Layout>
            <SrcPos X="6181" Y="6604"></SrcPos>
            <DestPos X="7239" Y="6604"></DestPos>
          </Layout>
        </DataConnection>
      </DataConnections>
    </Page>
  </Pages>
</FunctionDiagram>
`;
